export function button(name: string, buttonContent: string) {
  const button = document.createElement("button");
  button.className = `hud-button ${name}-button`;
  button.innerHTML = buttonContent;
  return button;
}
