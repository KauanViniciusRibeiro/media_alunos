// Quiz de uma pergunta por vez, com validação e navegação
const form = document.getElementById("quizForm");
if (form) {
  const msg = document.getElementById("msg");
  const questions = Array.from(document.querySelectorAll('.question'));
  let current = 0;

  // Gabarito das novas questões
  const gabarito = {
    q1: "B", // acirrou as disputas territoriais
    q2: "A", // economia de guerra/intervencionismo
    q3: "A", // crise do colonialismo, nacionalismo, totalitarismo
    q4: "B", // desigualdade de desenvolvimento/nacionalismo/corrida armamentista
    q5: "A", // nacionalismo eslavo aliado à desagregação do Império Turco
    q6: "E", // impôs duras sanções à Alemanha
    q7: "C", // interesse russo, nacionalismo eslavo, temor austríaco
    q8: "E", // difusão das ideias que apontavam as contradições do liberalismo
    q9: "C", // criação da Iugoslávia
    q10: "A" // degradação dos ideais liberais, crise econômica, desemprego
  };

  function showQuestion(idx) {
    questions.forEach((q, i) => q.style.display = i === idx ? 'block' : 'none');
    msg.textContent = "";
  }

  // Botão "Validar resposta" (próxima)
  questions.forEach((q, idx) => {
    const nextBtn = q.querySelector('.next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const name = `q${idx+1}`;
        const checked = form.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
          msg.style.color = "yellow";
          msg.textContent = "Selecione uma alternativa antes de continuar.";
          return;
        }
        msg.textContent = "";
        if (idx < questions.length - 1) {
          showQuestion(idx+1);
        }
      });
    }
    const prevBtn = q.querySelector('.prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showQuestion(idx-1);
      });
    }
  });

  // Submissão final
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Checar se todas respondidas
    for (let i = 1; i <= questions.length; i++) {
      if (![...form.querySelectorAll(`input[name="q${i}"]`)].some(r => r.checked)) {
        showQuestion(i-1);
        msg.style.color = "yellow";
        msg.textContent = `Responda a questão ${i} antes de finalizar.`;
        return;
      }
    }
    let acertos = 0;
    let erros = [];
    for (let i = 1; i <= questions.length; i++) {
      const marcada = [...form.querySelectorAll(`input[name="q${i}"]`)].find(r => r.checked)?.value;
      if (marcada === gabarito[`q${i}`]) acertos++;
      else erros.push(i);
    }
    const resultado = {
      data: new Date().toISOString(),
      acertos,
      erros
    };
    localStorage.setItem("quizResultado", JSON.stringify(resultado));
    msg.textContent = `Você acertou ${acertos} de ${questions.length} questões. ${erros.length ? "Erros nas questões: " + erros.join(", ") : "Perfeito!"}`;
    msg.style.color = acertos >= 7 ? "lightgreen" : "#ff4c4c";
    msg.scrollIntoView({behavior:'smooth', block:'center'});
    // Opcional: mostrar todas as questões novamente após finalizar
    // questions.forEach(q => q.style.display = "block");
  });

  // Iniciar mostrando a primeira questão
  showQuestion(0);
}
