// assets/js/views.js
export function loadView(view) {
  const url = `/Chatbot/vistas/${view}.php`;
  console.log('→ fetch vista:', url);
  fetch(url)
    .then(res => {
      console.log('← respuesta status', res.status);
      return res.text();
    })
    .then(html => {
      document.getElementById('view-container').innerHTML = html;
      if (view === 'chat' && window.initChat) {
        console.log('Inicializando chat');
        window.initChat();
      }
    })
    .catch(err => {
      console.error('Error al cargar vista:', err);
    });
}
export function loadViewWithParams(view, params) {
  const url = new URL(`/Chatbot/vistas/${view}.php`, window.location.origin);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  console.log('→ fetch vista con params:', url.toString());
  fetch(url)
    .then(res => {
      console.log('← respuesta status', res.status);
      return res.text();
    })
    .then(html => {
      document.getElementById('view-container').innerHTML = html;
      if (view === 'chat' && window.initChat) {
        console.log('Inicializando chat con params');
        window.initChat();
      }
    })
    .catch(err => {
      console.error('Error al cargar vista con params:', err);
    });
}
export function loadViewWithData(view, data) {
    const url = new URL(`/Chatbot/vistas/${view}.php`, window.location.origin);
    Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
    console.log('→ fetch vista con data:', url.toString());
    fetch(url)
      .then(res => {
        console.log('← respuesta status', res.status);
        return res.text();
      })
      .then(html => {
        document.getElementById('view-container').innerHTML = html;
        if (view === 'chat' && window.initChat) {
          console.log('Inicializando chat con data');
          window.initChat();
        }
      })
      .catch(err => {
        console.error('Error al cargar vista con data:', err);
      });
}
export function loadViewWithQuery(view, query) {    
  const url = new URL(`/Chatbot/vistas/${view}.php`, window.location.origin);
  url.searchParams.append('q', query);
  console.log('→ fetch vista con query:', url.toString());
  fetch(url)
    .then(res => {
      console.log('← respuesta status', res.status);
      return res.text();
    })
    .then(html => {
      document.getElementById('view-container').innerHTML = html;
      if (view === 'chat' && window.initChat) {
        console.log('Inicializando chat con query');
        window.initChat();
      }
    })
    .catch(err => {
      console.error('Error al cargar vista con query:', err);
    });
}
export function loadViewWithFormData(view, formData) {
  const url = new URL(`/Chatbot/vistas/${view}.php`, window.location.origin);
  console.log('→ fetch vista con FormData:', url.toString());
  fetch(url, {
    method: 'POST',
    body: formData
  })
    .then(res => {
      console.log('← respuesta status', res.status);
      return res.text();
    })
    .then(html => {
      document.getElementById('view-container').innerHTML = html;
      if (view === 'chat' && window.initChat) {
        console.log('Inicializando chat con FormData');
        window.initChat();
      }
    })
    .catch(err => {
      console.error('Error al cargar vista con FormData:', err);
    });
}