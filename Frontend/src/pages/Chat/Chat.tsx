import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProfileFromLocalStorage } from '../../utils/auth'
import eventsApi, { EventMessageApi, GetEventMessagesResult, CreateEventMessageResult } from '../../apis/events.api'
import usersApi from '../../apis/users.api'

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
  const { event_id } = useParams<{ event_id: string }>()

  const profileLocalStorage = getProfileFromLocalStorage()
  const CURRENT_USER_ID = profileLocalStorage?.id

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
        avatar_url: m.user_avatar_url ?? null
      }
    }))

    return { mapped, total_page: result.total_page, page: result.page }
  }

  const [messages, setMessages] = useState<UiMessage[]>([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [input, setInput] = useState('')
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [groups, setGroups] = useState<UiGroup[]>([])

  const messagesRef = useRef<HTMLDivElement | null>(null)
  const prevHeightRef = useRef<number | null>(null)
  const initialLoadRef = useRef<boolean>(true)
  const lastMessage = messages[messages.length - 1] ?? null
  const selectedGroup = useMemo(() => groups.find((g) => g.id === event_id) ?? null, [groups, event_id])

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

  // Scroll behavior
  useEffect(() => {
    const el = messagesRef.current
    if (!el) return

    if (initialLoadRef.current) {
      initialLoadRef.current = false
      requestAnimationFrame(() => {
        if (!messagesRef.current) return
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        prevHeightRef.current = messagesRef.current.scrollHeight
      })
      return
    }

    if (isLoadingMore && prevHeightRef.current != null) {
      const diff = el.scrollHeight - prevHeightRef.current
      el.scrollTop = el.scrollTop + diff
      prevHeightRef.current = el.scrollHeight
      setIsLoadingMore(false)
      return
    }

    prevHeightRef.current = el.scrollHeight
  }, [messages, isLoadingMore])

  const handleScroll = () => {
    if (!messagesRef.current) return
    const el = messagesRef.current
    if (el.scrollTop <= 24) {
      loadOlder()
    }
  }

  const loadOlder = async () => {
    if (isLoadingMore) return
    if (page >= totalPage) return

    prevHeightRef.current = messagesRef.current?.scrollHeight ?? null
    setIsLoadingMore(true)

    try {
      const nextPage = page + 1
      const { mapped, total_page, page: loadedPage } = await fetchMessagesPage(nextPage)

      // prepend older messages
      setMessages((prev) => [...mapped, ...prev])
      setPage(loadedPage)
      setTotalPage(total_page)
    } catch (e) {
      console.error('loadOlder error', e)
      setIsLoadingMore(false)
    }
  }

  // ---------- SEND MESSAGE (use eventsApi, not raw fetch) ----------

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    if (!CURRENT_USER_ID) {
      console.error('No CURRENT_USER_ID, user not logged in?')
      return
    }

    try {
      const res = await eventsApi.createEventMessage(event_id, trimmed)
      const result: CreateEventMessageResult = res.data.result

      const newMsg: UiMessage = {
        id: crypto.randomUUID(), // backend isn’t returning id; if you can, FIX backend to return id
        event_id: event_id,
        user_id: CURRENT_USER_ID,
        content: result.content,
        created_at: result.created_at,
        user: {
          id: CURRENT_USER_ID,
          name: profileLocalStorage?.name || 'You',
          avatar_url: profileLocalStorage?.avatar_url ?? null
        }
      }

      setMessages((prev) => [...prev, newMsg])
      setInput('')

      requestAnimationFrame(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
      })
    } catch (e) {
      console.error('handleSend error', e)
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
                      {last.user_id === CURRENT_USER_ID ? 'You: ' : ''}
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
        <div
          ref={messagesRef}
          className='flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-950 min-h-0'
          onScroll={handleScroll}
        >
          {isInitialLoading && (
            <div className='h-full flex items-center justify-center'>
              <p className='text-xs text-gray-500'>Loading messages…</p>
            </div>
          )}

          {!isInitialLoading && page < totalPage && (
            <div className='flex justify-center py-1 text-[11px] text-gray-500'>
              {isLoadingMore ? 'Loading older messages…' : 'Scroll up to load older messages'}
            </div>
          )}

          {!isInitialLoading &&
            messages.map((m) => {
              const mine = m.user_id === CURRENT_USER_ID
              return (
                <div key={m.id} className={`flex w-full gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                  {!mine && (
                    <div className='flex-shrink-0 mt-0.5'>
                      <div className='w-8 h-8 rounded-full bg-gray-700 grid place-items-center text-[11px] font-semibold'>
                        {getInitials(m.user.name)}
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
