import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import eventsApi, { EventMessageApi, GetEventMessagesResult } from '../../apis/events.api'
import usersApi from '../../apis/users.api'
import { socket } from '../../utils/socket'
import { AppContext } from '../../contexts/app.context'

type UiMessage = {
  id: string
  event_id: string
  user_id: string
  content: string
  created_at: string
  user: {
    id: string
    name: string
    avatar_url?: string | null
  }
}

type UiGroup = {
  id: string // event_id
  eventTitle: string // event_title
  eventPoster: string | null // poster_url
}

const PAGE_SIZE = 20

function getInitials(name?: string | null) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('')
}

function formatTimeShort(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatSidebarTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const { profile } = useContext(AppContext)
  const { event_id } = useParams<{ event_id: string }>()
  const navigate = useNavigate()
  const currentUserId = profile?.id
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [input, setInput] = useState('')
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [groups, setGroups] = useState<UiGroup[]>([])

  const messagesRef = useRef<HTMLDivElement | null>(null)
  // Scroll to bottom after initial load completes
  useEffect(() => {
    if (isInitialLoading) return
    if (!messagesRef.current) return

    requestAnimationFrame(() => {
      const el = messagesRef.current
      if (!el) return
      el.scrollTop = el.scrollHeight
    })
  }, [isInitialLoading, event_id])

  const lastMessage = messages[messages.length - 1] ?? null
  const selectedGroup = useMemo(() => groups.find((g) => g.id === event_id) ?? null, [groups, event_id])

  // ---------- SOCKET.IO SETUP ----------
  useEffect(() => {
    const handleMe = (user_id: string) => {
      console.log('me from socket:', user_id)
    }

    socket.on('me', handleMe)
    socket.emit('whoami')

    return () => {
      socket.off('me', handleMe)
    }
  }, [])

  // Join/leave event room
  useEffect(() => {
    if (!event_id) return
    socket.emit('join_event', event_id)
    return () => {
      socket.emit('leave_event', event_id)
    }
  }, [event_id])

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (msg) => {
      if (msg.event_id !== event_id) return

      const uiMsg: UiMessage = {
        id: msg.id,
        event_id: msg.event_id,
        user_id: msg.user_id,
        content: msg.content,
        created_at: msg.created_at,
        user: {
          id: msg.user_id,
          name: msg.user_name,
          avatar_url: msg.user_avatar_url
        }
      }

      setMessages((prev) => {
        if (prev.some((m) => m.id === uiMsg.id)) return prev
        return [...prev, uiMsg]
      })
    }

    socket.on('new_message', handleNewMessage)
    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [event_id])

  // ---------- LOAD MESSAGES FROM API ----------
  useEffect(() => {
    let cancelled = false

    async function loadGroups() {
      try {
        const res = await usersApi.searchMyTickets({
          limit: 20,
          page: 1
          // q is optional, not needed here
        })

        if (cancelled) return

        const tickets = res.data.result.tickets as any[]

        const mapped: UiGroup[] = tickets.map((t) => ({
          id: t.event_id,
          eventTitle: t.event_title,
          eventPoster: t.poster_url ?? null
        }))

        setGroups(mapped)
      } catch (e) {
        console.error('loadGroups error', e)
      }
    }

    loadGroups()

    return () => {
      cancelled = true
    }
  }, [])

  const fetchMessagesPage = async (pageToLoad: number) => {
    const res = await eventsApi.getEventMessages(event_id, PAGE_SIZE, pageToLoad)
    const result: GetEventMessagesResult = res.data.result

    const mapped: UiMessage[] = result.messages.map((m: EventMessageApi) => ({
      id: m.id,
      event_id: event_id,
      user_id: m.user_id,
      content: m.content,
      created_at: m.created_at,
      user: {
        id: m.user_id,
        name: m.user_name,
        avatar_url: m.user_avatar_url
      }
    }))

    mapped.sort((a, b) => a.created_at.localeCompare(b.created_at))

    return { mapped, total_page: result.total_page, page: result.page }
  }

  // ---------- RESET MESSAGES WHEN SWITCHING EVENT ----------
  useEffect(() => {
    // when changing group chat, wipe old messages immediately
    setMessages([])
    setIsInitialLoading(true)
  }, [event_id])

  // ---------- LOAD INITIAL MESSAGES ----------
  useEffect(() => {
    if (!event_id) return

    let cancelled = false

    async function loadInitial() {
      setIsInitialLoading(true)

      try {
        // fetch first page
        const first = await fetchMessagesPage(1)
        if (cancelled) return

        const total = first.total_page || 1
        let all = first.mapped

        // fetch remaining pages (2..total)
        for (let p = 2; p <= total; p++) {
          const res = await fetchMessagesPage(p)
          if (cancelled) return
          all = [...all, ...res.mapped]
        }

        // make sure messages are ordered by time (oldest -> newest)
        all.sort((a, b) => a.created_at.localeCompare(b.created_at))

        if (cancelled) return

        setMessages(all)
      } catch (e) {
        if (!cancelled) console.error('loadInitial error', e)
      } finally {
        if (!cancelled) setIsInitialLoading(false)
      }
    }

    loadInitial()

    return () => {
      cancelled = true
    }
  }, [event_id])

  // ---------- SEND MESSAGE (use eventsApi, not raw fetch) ----------

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    try {
      const res = (await eventsApi.createEventMessage(event_id, trimmed)) as any
      const result = res.data.result

      const newMsg: UiMessage = {
        id: result.id,
        event_id: result.event_id,
        user_id: result.user_id,
        content: result.content,
        created_at: result.created_at,
        user: {
          id: result.user_id,
          name: profile?.name || 'You',
          avatar_url: profile?.avatar_url ?? null
        }
      }

      // add locally
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev
        return [...prev, newMsg]
      })

      setInput('')

      requestAnimationFrame(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
      })
    } catch (e) {
      console.error('[handleSend] ERROR', e)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='flex h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden bg-gray-950 text-gray-100'>
      {/* LEFT: "Chats" sidebar – only one event for now, but design kept */}
      <aside className='w-80 border-r border-gray-800 flex flex-col min-h-0'>
        <div className='px-3 py-3 border-b border-gray-800'>
          <div className='text-lg font-semibold'>Chats</div>
        </div>

        <div className='px-3 py-2 border-b border-gray-800'>
          <input
            type='text'
            placeholder='Search in chats'
            className='w-full rounded-full bg-gray-900 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60'
            disabled
          />
        </div>

        <div className='flex-1 overflow-y-auto min-h-0'>
          {groups.map((g) => {
            const active = g.id === event_id
            const last = active ? lastMessage : null // you only have messages for current event

            return (
              <button
                key={g.id}
                type='button'
                onClick={() => navigate(`/events/${g.id}/messages`)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800/70 ${
                  active ? 'bg-gray-800' : ''
                }`}
              >
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 rounded-full bg-gray-700 grid place-items-center text-sm font-semibold'>
                    {g.eventPoster ? (
                      <img src={g.eventPoster} alt={g.eventTitle} className='w-10 h-10 rounded-full object-cover' />
                    ) : (
                      getInitials(g.eventTitle)
                    )}
                  </div>
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-sm font-medium truncate'>{g.eventTitle}</span>
                    {last && (
                      <span className='text-[11px] text-gray-500 flex-shrink-0'>
                        {formatSidebarTime(last.created_at)}
                      </span>
                    )}
                  </div>
                  {last && (
                    <p className='text-xs text-gray-400 truncate'>
                      {last.user_id === currentUserId ? 'You: ' : ''}
                      {last.content}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* CENTER: conversation */}
      <main className='flex-1 flex flex-col min-w-0 min-h-0'>
        {/* Top bar */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-800'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full bg-gray-700 grid place-items-center text-xs font-semibold'>
              {selectedGroup?.eventPoster ? (
                <img
                  src={selectedGroup.eventPoster}
                  alt={selectedGroup.eventTitle}
                  className='w-9 h-9 rounded-full object-cover'
                />
              ) : (
                getInitials(selectedGroup?.eventTitle ?? 'Group')
              )}
            </div>
            <div>
              <div className='text-sm font-semibold'>{selectedGroup?.eventTitle ?? 'Group'}</div>
              <div className='text-xs text-gray-500'>Event chat</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className='flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-950 min-h-0'>
          {isInitialLoading && (
            <div className='h-full flex items-center justify-center'>
              <p className='text-xs text-gray-500'>Loading messages…</p>
            </div>
          )}

          {!isInitialLoading &&
            messages.map((m) => {
              const mine = m.user_id === currentUserId
              return (
                <div key={m.id} className={`flex w-full gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                  {!mine && (
                    <div className='flex-shrink-0 mt-0.5'>
                      <div className='w-8 h-8 rounded-full bg-gray-700 grid place-items-center text-[11px] font-semibold'>
                        <img src={m.user.avatar_url} alt={m.user.name} className='w-8 h-8 rounded-full object-cover' />
                      </div>
                    </div>
                  )}
                  <div className={`max-w-[70%] ${mine ? 'items-end text-right' : ''}`}>
                    {!mine && <div className='text-[11px] text-gray-400'>{m.user.name}</div>}
                    <div
                      className={`inline-block px-3 py-2 rounded-2xl text-sm ${
                        mine ? 'bg-pink-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                      }`}
                    >
                      {m.content}
                    </div>
                    <div className='mt-0.5 text-[10px] text-gray-500'>{formatTimeShort(m.created_at)}</div>
                  </div>
                </div>
              )
            })}

          {!isInitialLoading && messages.length === 0 && (
            <div className='h-full flex items-center justify-center'>
              <p className='text-xs text-gray-500'>No messages yet.</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className='border-t border-gray-800 px-4 py-3 flex items-center gap-2 bg-gray-950'>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder='Type a message…'
            className='flex-1 resize-none bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none max-h-32'
          />
          <button
            type='button'
            onClick={handleSend}
            disabled={!input.trim()}
            className='rounded-xl bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-500'
          >
            Send
          </button>
        </div>
      </main>

      {/* RIGHT: empty panel for now */}
      <aside className='hidden lg:block w-80 border-l border-gray-800 bg-gray-950 min-h-0' />
    </div>
  )
}
