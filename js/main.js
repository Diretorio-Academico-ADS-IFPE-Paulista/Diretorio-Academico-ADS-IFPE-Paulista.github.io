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
              
              <!-- Injeta a imagem ou o ícone aqui, no topo do card -->
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
      conteiner.innerHTML = conteudoHTML;
     })
     .catch(error => {
       console.error('Erro:', error);
      });
});