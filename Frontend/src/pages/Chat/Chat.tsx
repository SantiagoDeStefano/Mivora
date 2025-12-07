import React, { useEffect, useMemo, useRef, useState } from 'react'

type Message = {
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

type GroupChat = {
  id: string
  name: string
  avatar_url?: string | null
  messages: Message[]
}

const CURRENT_USER_ID = 'me'
const PAGE_SIZE = 30

function uuid() {
  return crypto.randomUUID()
}

function minutesAgoToISO(minAgo: number) {
  return new Date(Date.now() - minAgo * 60_000).toISOString()
}

// ---------- MOCK DATA ----------

function generateMockGroup(id: string, name: string, offset: number): GroupChat {
  const messages: Message[] = []
  for (let i = 0; i < 80; i++) {
    const mine = i % 3 === 0
    messages.push({
      id: uuid(),
      event_id: id,
      user_id: mine ? CURRENT_USER_ID : `user-${id}-${i % 4}`,
      content: mine
        ? `My message #${i} in ${name}`
        : `Someone in ${name} said message #${i}`,
      created_at: minutesAgoToISO(offset + (80 - i)),
      user: {
        id: mine ? CURRENT_USER_ID : `user-${id}-${i % 4}`,
        name: mine ? 'You' : `Member ${i % 4}`,
        avatar_url: null
      }
    })
  }
  return { id, name, avatar_url: null, messages }
}

const INITIAL_GROUPS: GroupChat[] = [
  generateMockGroup('event-1', 'Web Development Group', 10),
  generateMockGroup('event-2', 'Product Design Hangout', 200),
  generateMockGroup('event-3', 'Meetup Organizers', 400),
  generateMockGroup('event-4', 'Internal Dev Chat', 800)
]

// ---------- UTIL ----------

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

// ---------- MAIN COMPONENT ----------

export default function ChatPage() {
  const [groups, setGroups] = useState<GroupChat[]>(INITIAL_GROUPS)
  const [selectedId, setSelectedId] = useState<string>(INITIAL_GROUPS[0]?.id)
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({})
  const [input, setInput] = useState('')
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const messagesRef = useRef<HTMLDivElement | null>(null)
  const prevHeightRef = useRef<number | null>(null)
  const justSwitchedRoomRef = useRef(false)

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedId) ?? groups[0],
    [groups, selectedId]
  )

  const selectedMessages = useMemo(() => {
    if (!selectedGroup) return []
    const total = selectedGroup.messages.length
    const count = visibleCount[selectedGroup.id] ?? Math.min(PAGE_SIZE, total)
    const clamped = Math.min(count, total)
    return selectedGroup.messages.slice(total - clamped, total)
  }, [selectedGroup, visibleCount])

  // init visibleCount for selected group
  useEffect(() => {
    if (!selectedGroup) return
    setVisibleCount((prev) => {
      if (prev[selectedGroup.id] != null) return prev
      const total = selectedGroup.messages.length
      return {
        ...prev,
        [selectedGroup.id]: Math.min(PAGE_SIZE, total)
      }
    })
    justSwitchedRoomRef.current = true
  }, [selectedGroup])

  // scrolling behaviour
  useEffect(() => {
    const el = messagesRef.current
    if (!el) return

    if (justSwitchedRoomRef.current) {
      justSwitchedRoomRef.current = false
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
  }, [selectedMessages, isLoadingMore])

  const handleScroll = () => {
    if (!messagesRef.current || !selectedGroup) return
    const el = messagesRef.current
    if (el.scrollTop <= 24) {
      loadOlder()
    }
  }

  const loadOlder = () => {
    if (!selectedGroup) return
    const total = selectedGroup.messages.length
    const current = visibleCount[selectedGroup.id] ?? Math.min(PAGE_SIZE, total)
    if (current >= total || isLoadingMore) return

    prevHeightRef.current = messagesRef.current?.scrollHeight ?? null
    setIsLoadingMore(true)
    setVisibleCount((prev) => ({
      ...prev,
      [selectedGroup.id]: Math.min(current + PAGE_SIZE, total)
    }))
  }

  const handleSend = () => {
    if (!selectedGroup) return
    const trimmed = input.trim()
    if (!trimmed) return

    const newMsg: Message = {
      id: uuid(),
      event_id: selectedGroup.id,
      user_id: CURRENT_USER_ID,
      content: trimmed,
      created_at: new Date().toISOString(),
      user: {
        id: CURRENT_USER_ID,
        name: 'You',
        avatar_url: null
      }
    }

    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroup.id ? { ...g, messages: [...g.messages, newMsg] } : g
      )
    )

    setVisibleCount((prev) => ({
      ...prev,
      [selectedGroup.id]:
        (prev[selectedGroup.id] ??
          Math.min(PAGE_SIZE, selectedGroup.messages.length)) + 1
    }))

    setInput('')

    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
      }
    })
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    // IMPORTANT: this wrapper does NOT let the page grow; scrolling is inside children only
    <div className="flex h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden bg-gray-950 text-gray-100">
      {/* LEFT: group list */}
      <aside className="w-80 border-r border-gray-800 flex flex-col min-h-0">
        <div className="px-3 py-3 border-b border-gray-800">
          <div className="text-lg font-semibold">Chats</div>
        </div>

        <div className="px-3 py-2 border-b border-gray-800">
          <input
            type="text"
            placeholder="Search in chats"
            className="w-full rounded-full bg-gray-900 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {groups.map((g) => {
            const last = g.messages[g.messages.length - 1]
            const active = g.id === selectedGroup?.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedId(g.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800/70 ${
                  active ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-700 grid place-items-center text-sm font-semibold">
                    {getInitials(g.name)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{g.name}</span>
                    {last && (
                      <span className="text-[11px] text-gray-500 flex-shrink-0">
                        {formatSidebarTime(last.created_at)}
                      </span>
                    )}
                  </div>
                  {last && (
                    <p className="text-xs text-gray-400 truncate">
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
      <main className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-700 grid place-items-center text-xs font-semibold">
              {getInitials(selectedGroup?.name)}
            </div>
            <div>
              <div className="text-sm font-semibold">
                {selectedGroup?.name ?? 'Group'}
              </div>
              <div className="text-xs text-gray-500">Group chat</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-950 min-h-0"
          onScroll={handleScroll}
        >
          {selectedGroup &&
            (visibleCount[selectedGroup.id] ?? 0) < selectedGroup.messages.length && (
              <div className="flex justify-center py-1 text-[11px] text-gray-500">
                {isLoadingMore
                  ? 'Loading older messages…'
                  : 'Scroll up to load older messages'}
              </div>
            )}

          {selectedMessages.map((m) => {
            const mine = m.user_id === CURRENT_USER_ID
            return (
              <div
                key={m.id}
                className={`flex w-full gap-2 ${mine ? 'justify-end' : 'justify-start'}`}
              >
                {!mine && (
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-gray-700 grid place-items-center text-[11px] font-semibold">
                      {getInitials(m.user.name)}
                    </div>
                  </div>
                )}
                <div className={`max-w-[70%] ${mine ? 'items-end text-right' : ''}`}>
                  {!mine && (
                    <div className="text-[11px] text-gray-400">{m.user.name}</div>
                  )}
                  <div
                    className={`inline-block px-3 py-2 rounded-2xl text-sm ${
                      mine
                        ? 'bg-pink-600 text-white rounded-br-sm'
                        : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                  <div className="mt-0.5 text-[10px] text-gray-500">
                    {formatTimeShort(m.created_at)}
                  </div>
                </div>
              </div>
            )
          })}

          {selectedMessages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-gray-500">No messages yet.</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 px-4 py-3 flex items-center gap-2 bg-gray-950">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a message…"
            className="flex-1 resize-none bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none max-h-32"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="rounded-xl bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-500"
          >
            Send
          </button>
        </div>
      </main>

      {/* RIGHT: empty panel for now */}
      <aside className="hidden lg:block w-80 border-l border-gray-800 bg-gray-950 min-h-0" />
    </div>
  )
}
