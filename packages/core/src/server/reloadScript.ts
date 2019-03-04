export const reloadScript = (port: number) => `<script>
const socket = new WebSocket('ws://localhost:${port}')
socket.onmessage = (message) => {
  const data = JSON.parse(message.data)
  if (data.reload) {
    window.location.reload();
  }
}
</script>`;
