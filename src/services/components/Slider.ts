export function slider() {
  const container = document.createElement("div");
  //container.className = "slide-container";

  const span = document.createElement("span");
  span.id = "slider-number";
  span.textContent = "0";

  const input = document.createElement("input");
  input.type = "range";
  input.min = "-100";
  input.max = "100";
  input.step = "0.1";
  input.value = "1";
  input.className = "slider";
  input.id = "scale-range";

  container.appendChild(span);
  container.appendChild(input);

  return container;
}
