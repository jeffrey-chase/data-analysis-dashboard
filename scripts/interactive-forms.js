(function(){
  window.onload = function() {
    document.querySelector("#username").onfocus = showLabel;
    document.querySelector("#password").onfocus = showLabel;
    document.querySelector("#username").onblur = hideLabels;
    document.querySelector("#password").onblur = hideLabels;
  }
  
  function hideLabels () {
    let id = this.id;
    let label = document.querySelector("label[for='"+id+"']");
    console.log(this.id);
    let placeholder = id.charAt(0).toUpperCase() + this.id.substr(1);
    this.placeholder = placeholder;
    label.className = "interactive";
  }
  
  function showLabel() {
    let id = this.id;
    console.log("label[for='"+id+"']");
    let label = document.querySelector("label[for='"+id+"']");
    
    label.className = "interactive show";
    
    this.setAttribute('placeholder', '');
    
  }
})();