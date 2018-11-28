export const reloadScript = (port: number) => `<script type='text/javascript'>
const socket = new WebSocket('ws://localhost:${port}')
socket.onmessage = (msg) => {
  console.log("message:", msg);
  const data = JSON.parse(msg.data)
  if (data.reload) {
    window.location.reload();
  }
}
</script>`;
