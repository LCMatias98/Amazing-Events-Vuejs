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
        eventosFiltrados: [],
        eventosPasados:[],
        eventosFuturos:[],
        arrayResultados:[],
        arrayResultadoPast:[],
        highestAttendanceEvent:[],
        lowestAttendaceEvent:[],
        largestCapacityEvent:[]
      }

    },

    created(){
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
        .then(res => res.json())
        .then(data =>{
            
            this.arrayEventos = data.events
            this.eventosFiltrados = data.events
            this.eventosPasados = data.events.filter((evento) => evento.date <= data.currentDate)
            this.eventosFuturos = data.events.filter((evento) => evento.date >= data.currentDate)

            const categories =  Array.from ( new Set ( this.arrayEventos.map (( event) => event.category)))
            this.arrayCategories = categories

            //nombre, asistencia y capacidad de los eventos
            this.nameAndAssistance = this.arrayEventos.filter((event) => event.assistance).map((event) => ({name: event.name,assistance: ((event.assistance / event.capacity) * 100).toFixed(2),capacity: event.capacity}));
            console.log(this.nameAndAssistance)
            //evento de mayor asitencia
            this.highestAttendanceEvent = this.nameAndAssistance.reduce(
            (actualEvent, nextEvent) => {
                return actualEvent.assistance > nextEvent.assistance ? actualEvent : nextEvent;
            });

            //evento de menor asistencia
            this.lowestAttendaceEvent = this.nameAndAssistance.reduce(
                (actualEvent, nextEvent) => {
                return actualEvent.assistance < nextEvent.assistance ? actualEvent : nextEvent;
                });

            //evento de mayor capacidad
            this.largestCapacityEvent = this.nameAndAssistance.reduce((actualEvent, nextEvent) =>{
            return actualEvent.capacity > nextEvent.capacity ? actualEvent : nextEvent
            });


            let arrayCategoria = this.eventosFuturos.map((evento) => evento.category)
            let setCategorias = new Set(arrayCategoria)
            this.arrayCategorias = Array.from(setCategorias)

            let arrayCategoriaPast = this.eventosPasados.map((evento) => evento.category)
            let setCategoriasPast = new Set(arrayCategoriaPast)
            this.arrayCategoriaPast = Array.from(setCategoriasPast)

            this.generateEventInfoFuture()
            this.generateEventInfoPast()
            console.log(this.arrayResultados)
        })
        .catch(error => console.log(error))
    },

    // Metodos que se ejecutan una vez
    methods:{
     
            generateEventInfoFuture() {
                const eventoInfo = [];
                this.arrayCategorias.forEach((category) => {
                  const eventoFuturo = this.eventosFuturos.filter((event) => event.category === category);
                  let totalRevenue = 0;
                  let totalAssistance = 0;
          
                  eventoFuturo.forEach((event) => {
                    totalRevenue += (event.estimate * event.price);
                    totalAssistance += ((event.estimate / event.capacity) * 100);
                  });
          
                  const averageAssistance = totalAssistance / eventoFuturo.length;
          
                  eventoInfo.push({
                    category: category,
                    totalRevenue: totalRevenue,
                    averageAssistance: averageAssistance.toFixed(2),
                  });
                });
          
                this.arrayResultados=eventoInfo
              },
              generateEventInfoPast() {
                const eventoInfo = [];
                this.arrayCategoriaPast.forEach((category) => {
                  const eventoPasado = this.eventosPasados.filter((event) => event.category === category);
                  let totalRevenue = 0;
                  let totalAssistance = 0;
          
                  eventoPasado.forEach((event) => {
                    totalRevenue += (event.assistance * event.price);
                    totalAssistance += ((event.assistance / event.capacity) * 100);
                  });
          
                  const averageAssistance = totalAssistance / eventoPasado.length;
          
                  eventoInfo.push({
                    category: category,
                    totalRevenue: totalRevenue,
                    averageAssistance: averageAssistance.toFixed(2),
                  });
                });
          
                this.arrayResultadoPast=eventoInfo
              },

             
    }
}).mount('#app')