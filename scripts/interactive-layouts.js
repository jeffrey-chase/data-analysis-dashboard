(function () {
  window.addEventListener('load', (event) => {
    let tabs = document.querySelectorAll(".tab button");
    for (let i = 0; i < tabs.length; i++){
      tabs[i].addEventListener('click', switchTab);
    }
  })
  
  
  function switchTab(event) {
    let showId = this.id + "-section";
    console.log('switch')
    let tabContents = document.querySelectorAll('.tabbed');
    let tabs = document.querySelectorAll('.tab button');
    for (let i = 0; i < tabs.length; i++){
      let id = tabContents[i].getAttribute('id');
      tabContents[i].style.display = id === showId ? "block" :"none";
      tabs[i].classList.remove('active');
      
    }
    this.classList.add('active');
  }
})();
