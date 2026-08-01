const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = 'assets/img/logo.ico';
favicon.type = 'image/x-icon';
document.head.appendChild(favicon);

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
        const midiaPerfil = membro.foto 
          ? `<img src="${membro.foto}" class="card-img-top" alt="Foto de ${membro.nome}" style="height: 250px; object-fit: cover;">`
          : `<div class="card-img-top d-flex justify-content-center align-items-center bg-light" style="height: 250px;">
               <i class="bi bi-person-circle text-secondary" style="font-size: 6rem;"></i>
             </div>`;

        conteudoHTML += `
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card shadow-sm h-100 text-center">
              
              ${midiaPerfil}
              
              <div class="card-body">
                <h5 class="card-title text-primary fw-bold">${membro.nome}</h5>
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

      professores.forEach(professor => {
        const avatarPerfil = professor.foto
          ? `<img src="${professor.foto}" class="avatar-professor" alt="Foto de ${professor.nome}">`
          : `<div class="avatar-professor d-flex justify-content-center align-items-center bg-light">
               <i class="bi bi-person-circle text-secondary" style="font-size: 3.2rem;"></i>
             </div>`;

        const badgesDisciplinas = professor.disciplinas
          .map(disciplina => `<span class="badge-disciplina">${disciplina}</span>`)
          .join('');

        const contatoEmail = professor.email
          ? `<a href="mailto:${professor.email}" class="contato-email"><i class="bi bi-envelope"></i> ${professor.email}</a>`
          : '';

        const badgeCoordenador = professor.coordenador
          ? `<span class="badge-coordenador"><i class="bi bi-award-fill"></i> Coordenador do Curso</span>`
          : '';

        conteudoHTML += `
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card shadow-sm h-100 text-center card-professor ${professor.coordenador ? 'card-coordenador' : ''}">
              <div class="card-body d-flex flex-column align-items-center">

                ${badgeCoordenador}
                ${avatarPerfil}

                <h5 class="card-title text-primary fw-bold mt-3 mb-2">${professor.nome}</h5>
                <div class="mb-3">${badgesDisciplinas}</div>
                <div class="mt-auto">${contatoEmail}</div>
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