// Chame essa função sempre que uma nova janela for aberta ou fechada
document.querySelectorAll(".app").forEach((appElement) => {
  appElement.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevenir comportamento padrão do link

    const execPath = event.currentTarget.getAttribute("data-exec");

    if (execPath) {
      // Enviar para o processo principal para executar o comando
      window.electronAPI.executeApp(execPath);
    }
  });
});

let slideDownDelay;
document.body.addEventListener("mouseover", (e) => {
  console.log("mouseover");
  clearInterval(slideDownDelay);
  window.electronAPI.updateFocus(true);
  document.querySelector(".dock").style.animation = "slideUp 500ms";
});
document.body.addEventListener("mouseleave", (e) => {
  console.log("mouseleave");
  slideDownDelay = setTimeout(() => {
    document.querySelector(".dock").style.animation = "slideDown 500ms";
    const delay = setTimeout(() => {
      window.electronAPI.updateFocus(false);
      clearTimeout(delay);
    }, 499);
  }, 800);
});
