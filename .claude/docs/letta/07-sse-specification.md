# Server-Sent Events (SSE) - Reference

**Source**: W3C HTML Specification, MDN Web Docs  
**Purpose**: Standard for server-to-client streaming over HTTP  
**Last Updated**: 2026-01-24

---

## Overview

Server-Sent Events (SSE) is a web standard that enables servers to push real-time updates to clients over HTTP. Unlike WebSockets, SSE is unidirectional (server → client only) and uses simple text-based format.

**Specification**: [WHATWG HTML Standard - Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html)

---

## Protocol

### HTTP Headers

**Server MUST send these headers**:

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

### Event Format

Events are plain text following this structure:

```
field: value\n
field: value\n
\n
```

**Fields**:
- `event`: Event type (optional, defaults to "message")
- `data`: Event payload (can be multi-line)
- `id`: Event ID for reconnection
- `retry`: Reconnection time in milliseconds

**Example**:
```
event: userconnect
data: {"username": "john_doe"}

event: message
data: Hello
data: World

id: 123
data: {"status": "complete"}

retry: 3000

```

---

## Client API (JavaScript)

### Basic Usage

```javascript
const eventSource = new EventSource('/api/stream');

// Listen to all events
eventSource.onmessage = function(event) {
  console.log('Data:', event.data);
};

// Listen to specific event type
eventSource.addEventListener('userconnect', function(event) {
  console.log('User connected:', event.data);
});

// Handle errors
eventSource.onerror = function(event) {
  console.error('Error occurred');
};

// Close connection
eventSource.close();
```

### EventSource Properties

```javascript
eventSource.url           // The endpoint URL
eventSource.readyState    // 0=CONNECTING, 1=OPEN, 2=CLOSED
eventSource.withCredentials // Whether to send cookies
```

---

## Reconnection Behavior

**Automatic Reconnection**:
- Client automatically reconnects if connection drops
- Default retry interval: 3 seconds
- Server can set custom retry via `retry:` field

**Last Event ID**:
- Client sends `Last-Event-ID` header on reconnect
- Server can use this to resume from last event

```http
GET /api/stream HTTP/1.1
Last-Event-ID: 123
```

---

## CORS Requirements

For cross-origin requests, server MUST include:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

---

## Limitations

1. **Unidirectional**: Server → Client only (use WebSocket for bidirectional)
2. **Connection Limits**: Browsers limit ~6 concurrent SSE per domain (HTTP/1.1)
3. **Text Only**: Binary data requires base64 encoding
4. **No Custom Headers**: Client cannot send custom headers (use query params)

---

## Use Cases

**Ideal For**:
- Real-time notifications
- Live dashboards
- Chat messages (one-way)
- Progress updates
- Stock tickers

**NOT Ideal For**:
- Bidirectional communication (use WebSocket)
- Binary data streaming
- High-frequency updates (>100/sec)

---

## Testing with cURL

```bash
# Basic SSE stream
curl -N -H "Accept: text/event-stream" \
  http://localhost:4000/api/stream

# With authentication
curl -N -H "Accept: text/event-stream" \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:4000/api/stream

# With Last-Event-ID
curl -N -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 123" \
  http://localhost:4000/api/stream
```

---

## Error Handling

**Connection Errors**:
- `onerror` event fires
- EventSource automatically reconnects
- Check `readyState` to determine status

**Example**:
```javascript
eventSource.onerror = function(event) {
  if (event.target.readyState === EventSource.CLOSED) {
    console.log('Connection closed');
  } else {
    console.log('Connection error, will retry');
  }
};
```

---

## Security Considerations

1. **Authentication**: Use tokens in URL or cookies (no custom headers)
2. **CORS**: Restrict origins in production
3. **Rate Limiting**: Limit connections per user/IP
4. **Timeout**: Close idle connections after timeout

---

## Browser Support

**Fully Supported**:
- Chrome/Edge: All versions
- Firefox: All versions
- Safari: All versions
- Opera: All versions

**NOT Supported**:
- Internet Explorer (use polyfill)

**Polyfill**: [EventSource Polyfill](https://github.com/Yaffle/EventSource)

---

## References

- [MDN: Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [WHATWG Spec](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [Can I Use SSE](https://caniuse.com/eventsource)
