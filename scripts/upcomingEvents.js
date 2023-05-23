const currentUrl = window.location.href;
const links = document.querySelectorAll(".navbar-nav li a");
for (let link of links) {
  if (link.href === currentUrl) {
    link.parentElement.classList.add("active")
  }
}

// https://mindhub-xj03.onrender.com/api/amazing

const { createApp } = Vue

  createApp({
    // Propiedades reactivas
    data() {
      return {
        message: 'Hello Vue!',
        arrayEventos: [],
        input: "",
        checkedNames:[],
        eventosFiltrados: [],
        arrayCategoria:[]
      }

    },

    created(){
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
        .then(res => res.json())
        .then(data =>{
            this.arrayEventos = data.events.filter((evento) => evento.date > data.currentDate)
            this.eventosFiltrados =  data.events.filter((evento) => evento.date > data.currentDate)
            /* console.log(this.eventosFiltrados) */
            this.categorias()
       
        })
        .catch(error => console.log(error))
    },

    // Metodos que se ejecutan una vez
    methods:{
        categorias: function(){
            let arrayCategoria = this.eventosFiltrados.map((evento) => evento.category)
            let setCategorias = new Set(arrayCategoria)
            this.arrayCategorias = Array.from(setCategorias) 
            /* console.log(arrayCategoria) */
      }
    },

    // Escuchador
    computed:{

        filtroCruzado: function(){
          let filtrarPorNames = this.arrayEventos.filter((evento) => evento.name.toLowerCase().includes(this.input.toLowerCase()))
          if(this.checkedNames.length == 0){
            this.eventosFiltrados = filtrarPorNames
          }else{
            this.eventosFiltrados = filtrarPorNames.filter((evento) => this.checkedNames.includes(evento.category))
          }
        }
    }

  }).mount('#app')