const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = 'assets/img/logo.ico';
favicon.type = 'image/x-icon';
document.head.appendChild(favicon);

const DATAS_INGRESSO = {
    abertura: new Date(2026, 7, 20),   /* 14/08/2026 */
    encerramento: new Date(2026, 8, 22),   /* 21/08/2026 */
};

const temaSalvo = localStorage.getItem('tema_da_ads') || 'light';
document.documentElement.setAttribute('data-bs-theme', temaSalvo);

document.addEventListener('DOMContentLoaded', () => {
  const botoesTurma = document.querySelectorAll('.btn-turma-horario');
  const painelHorarios = document.getElementById('conteudoHorario');

  if (botoesTurma.length > 0 && painelHorarios) {
    botoesTurma.forEach(botao => {
      botao.addEventListener('click', () => {
        botoesTurma.forEach(b => b.classList.remove('active'));
        botao.classList.add('active');

        painelHorarios.querySelectorAll('.tab-pane').forEach(painel => {
          painel.classList.remove('show', 'active');
        });

        const alvo = document.querySelector(botao.dataset.bsTarget);
        if (alvo) {
          alvo.classList.add('show', 'active');
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-include]').forEach((element) => {
    const includePath = element.getAttribute('data-include');

    if (includePath) {
      fetch(includePath)
        .then(response => {
          if (!response.ok) throw new Error('Erro ao carregar e exibir o componente: ' + includePath);
          return response.text();
        })
        .then(html => {
          element.outerHTML = html;

          if (includePath.includes('nav.html')) {
            linkAtivo();
            configurarTema();
          }

          if (includePath.includes('footer.html')) {
            const btnTopo = document.getElementById('btn-topo');

            window.addEventListener('scroll', () => {
              if (window.scrollY > 300) {
                btnTopo.classList.add('mostrar');
              } else {
                btnTopo.classList.remove('mostrar');
              }
            });

            btnTopo.addEventListener('click', () => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          }
              })
        .catch(error => console.error(error));
    }
  });
});

function linkAtivo() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const linkPage = link.getAttribute('href');

    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/diretoria.json')
    .then(response => {
      if(!response.ok){
        throw new Error('Erro ao carregar o arquivo JSON');
      }
      return response.json();
    })
    .then(diretoria => {
      const conteiner = document.getElementById('cardsEquipe');
      let conteudoHTML = '';

      diretoria.forEach(membro => {
        const avatarPerfil = membro.foto
          ? `<img src="${membro.foto}" class="avatar-professor" alt="Foto de ${membro.nome}">`
          : `<div class="avatar-professor d-flex justify-content-center align-items-center bg-light">
               <i class="bi bi-person-circle text-secondary" style="font-size: 3.2rem;"></i>
             </div>`;

        conteudoHTML += `
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card shadow-sm h-100 text-center">
              <div class="card-body d-flex flex-column align-items-center">

                ${avatarPerfil}

                <h5 class="card-title text-primary fw-bold mt-3 mb-2">${membro.nome}</h5>
                <p class="card-text text-muted mb-1"><strong>Diretoria:</strong> ${membro.diretoria}</p>
                <p class="card-text text-muted"><strong>Cargo:</strong> ${membro.cargo}</p>
              </div>
            </div>
          </div>
        `;
      });
      if(conteiner){
        conteiner.innerHTML = conteudoHTML;
      }
     })
     .catch(error => {
       console.error('Erro:', error);
      });
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/professores.json')
    .then(response => {
      if(!response.ok){
        throw new Error('Erro ao carregar o arquivo JSON');
      }
      return response.json();
    })
    .then(professores => {
      const conteiner = document.getElementById('cardsProfessores');
      let conteudoHTML = '';

      professores.forEach((professor, indice) => {
        const avatarPerfil = professor.foto
          ? `<img src="${professor.foto}" class="avatar-professor" alt="Foto de ${professor.nome}">`
          : `<div class="avatar-professor d-flex justify-content-center align-items-center bg-light">
               <i class="bi bi-person-circle text-secondary" style="font-size: 3.2rem;"></i>
             </div>`;

        const badgesDisciplinas = professor.disciplinas
          .map(disciplina => `<span class="badge-disciplina">${disciplina}</span>`)
          .join('');

        const badgeCoordenador = professor.coordenador
          ? `<span class="badge-coordenador"><i class="bi bi-award-fill"></i> Coordenador do Curso</span>`
          : professor.vicecoordenador
          ? `<span class="badge-coordenador"><i class="bi bi-award"></i> Vice-coordenador do Curso</span>`
          : '';

        conteudoHTML += `
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card shadow-sm h-100 text-center card-professor position-relative ${(professor.coordenador || professor.vicecoordenador) ? 'card-coordenador' : ''}">
              ${badgeCoordenador}
              <div class="card-body d-flex flex-column align-items-center">

                ${avatarPerfil}

                <h5 class="card-title text-primary fw-bold mt-3 mb-2">${professor.nome}</h5>
                <div class="mb-3">${badgesDisciplinas}</div>
                <button type="button" class="btn btn-outline-primary btn-sm btn-ver-detalhes" data-indice="${indice}">
                  Ver mais
                </button>
              </div>
            </div>
          </div>
        `;
      });
      if(conteiner){
        conteiner.innerHTML = conteudoHTML;
      }

      const modalProfessorEl = document.getElementById('modalProfessor');
      if (modalProfessorEl) {
        const modalProfessor = new bootstrap.Modal(modalProfessorEl);

        document.querySelectorAll('.btn-ver-detalhes').forEach(botao => {
          botao.addEventListener('click', () => {
            const professor = professores[Number(botao.dataset.indice)];

            document.getElementById('modalProfessorFoto').src = professor.foto || 'assets/img/logo.png';
            document.getElementById('modalProfessorFoto').alt = `Foto de ${professor.nome}`;
            document.getElementById('modalProfessorNome').textContent = professor.nome;
            document.getElementById('modalProfessorDisciplinas').innerHTML = professor.disciplinas
              .map(disciplina => `<span class="badge-disciplina">${disciplina}</span>`)
              .join('');
            const formacaoContainer = document.getElementById('modalProfessorFormacao');
            formacaoContainer.innerHTML = (professor.formacao || [])
              .map(item => `
                <div class="col-4">
                  <div class="card-stat text-center">
                    <i class="bi bi-mortarboard-fill card-stat-icon text-primary"></i>
                    <div class="card-stat-label mb-1">${item.nivel}</div>
                    <div class="card-stat-valor">${item.curso || ''}</div>
                    <div class="card-stat-label">${item.instituicao} · ${item.ano}</div>
                  </div>
                </div>
              `)
              .join('');

            document.getElementById('modalProfessorDescricao').textContent = professor.descricao || 'Descrição em breve.';

            const linkEmail = document.getElementById('modalProfessorEmail');
            if (professor.email) {
              linkEmail.href = `mailto:${professor.email}`;
              linkEmail.innerHTML = `<i class="bi bi-envelope"></i> ${professor.email}`;
              linkEmail.classList.remove('d-none');
            } else {
              linkEmail.classList.add('d-none');
            }

            modalProfessor.show();
          });
        });
      }
     })
     .catch(error => {
       console.error('Erro:', error);
      });
});

function montarConteudoEvento(evento) {
  const estiloFundo = evento.imagem
    ? `background-image: url('${evento.imagem}');`
    : '';

  return `
    <div class="evento-slide ${evento.imagem ? '' : 'evento-slide-sem-foto'}" style="${estiloFundo}">
      <div class="evento-overlay">
        <span class="badge-evento-data"><i class="bi bi-calendar-event"></i> ${evento.data}</span>
        <h3 class="fw-bold mt-2 mb-1">${evento.titulo}</h3>
        <p class="mb-1"><i class="bi bi-geo-alt"></i> ${evento.local}</p>
        <p class="mb-0">${evento.descricao}</p>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/eventos.json')
    .then(response => {
      if(!response.ok){
        throw new Error('Erro ao carregar o arquivo JSON');
      }
      return response.json();
    })
    .then(eventos => {
      const teaserTitulo = document.getElementById('teaserEventoTitulo');
      const teaserData = document.getElementById('teaserEventoData');

      if (teaserTitulo && teaserData && eventos.length > 0) {
        teaserTitulo.textContent = eventos[0].titulo;
        teaserData.textContent = eventos[0].data;
      }

      const inner = document.getElementById('carouselInnerEventos');
      const indicadores = document.getElementById('indicadoresEventos');

      if (!inner || !indicadores) return;

      let slidesHTML = '';
      let indicadoresHTML = '';

      eventos.forEach((evento, indice) => {
        const ativo = indice === 0 ? 'active' : '';

        slidesHTML += `<div class="carousel-item ${ativo}">${montarConteudoEvento(evento)}</div>`;

        indicadoresHTML += `
          <button type="button" data-bs-target="#carouselEventos" data-bs-slide-to="${indice}" class="${ativo}" aria-current="${indice === 0 ? 'true' : 'false'}" aria-label="Evento ${indice + 1}"></button>
        `;
      });

      inner.innerHTML = slidesHTML;
      indicadores.innerHTML = indicadoresHTML;
     })
     .catch(error => {
       console.error('Erro:', error);
      });
});

function configurarTema() {
  const btnTema = document.getElementById('btnTema');
  const iconeTema = document.getElementById('iconeTema');
  const htmlTag = document.documentElement;

  if (!btnTema) return;

  if (htmlTag.getAttribute('data-bs-theme') === 'dark') {
    iconeTema.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
  }
  btnTema.addEventListener('click', () => {
    const temaAtual = htmlTag.getAttribute('data-bs-theme');
    
    if (temaAtual === 'dark') {
      htmlTag.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('tema_da_ads', 'light');
      iconeTema.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
    } else {
      htmlTag.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('tema_da_ads', 'dark');
      iconeTema.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const modalIngresso = document.getElementById('modal-ingresso');
  const btnEtapasIngresso = document.getElementById('botao-modal-etapas');
  const btnLinkForms = document.getElementById('botao-modal-forms');
  const btnFecharModalIngresso = document.getElementById('modal-ingresso-fechar');

  modalIngresso.style.display = 'block';

  btnFecharModalIngresso.onclick = () => {
    modalIngresso.style.display = 'none';
  }

  window.onclick = (event) => {
    if (event.target === modalIngresso) {
      modalIngresso.style.display = 'none';
    }
  }
});