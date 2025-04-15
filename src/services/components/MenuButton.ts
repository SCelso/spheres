export function menuButton(
  name: string,
  toggleContent: string,
  menuOptions: string[]
) {
  const container = document.createElement("div");
  container.className = `menu-container menu-${name}`;

  // <input type="checkbox" id="moons-toggle">
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `${name}-toggle`;

  // <label for="moons-toggle" class="menu-button hud-button">
  const label = document.createElement("label");
  label.setAttribute("for", `${name}-toggle`);
  label.className = "menu-button hud-button";

  // <div class="menu-options">${menuOptions}</div>
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "menu-options";

  menuOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    optionsDiv.appendChild(button);
  });

  // <span class="toggle-icon">${toggleContent}</span>
  const toggleSpan = document.createElement("span");
  toggleSpan.className = "toggle-icon";
  toggleSpan.innerHTML = toggleContent;

  // Armar estructura
  label.appendChild(optionsDiv);
  label.appendChild(toggleSpan);
  container.appendChild(checkbox);
  container.appendChild(label);

  return container;
}
