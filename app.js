let filters={
    brightness:{
        value:100,
        min:0,
        max:200,
        unit:"%"
    },
    contrast:{
        value:100,
        min:0,
        max:200,
        unit:"%"
    },
    exposure:{
        value:100,
        min:0,
        max:200,
        unit:"%"
    },
    saturation:{
        value:100,
        min:0,
        max:200,
        unit:"%"
    },
    huerotation:{
        value:0,
        min:0,
        max:360,
        unit:"deg"
    },
    blur:{
        value:0,
        min:0,
        max:20,
        unit:"px"
    },
    grayscale:{
        value:0,
        min:0,
        max:100,
        unit:"%"
    },
    sepia:{
        value:0,
        min:0,
        max:100,
        unit:"%"
    },
    opacity:{
        value:100,
        min:0,
        max:100,
        unit:"%"
    },
    invert:{
        value:0,
        min:0,
        max:100,
        unit:"%"
    }
}

const filterContainer=document.querySelector(".filters")
const canvasImage=document.querySelector("#image-canvas")
const canvasCtx=canvasImage.getContext("2d")
const imageInput=document.querySelector("#image-input")
const Reset=document.querySelector("#reset-btn")
const download=document.querySelector("#download-btn")
let file=null
let img=null

function createFilterElement(name,unit="%",value,min,max){
  const div=document.createElement("div");
  div.classList.add("filter")

  const input=document.createElement("input")
  input.type="range"
  input.min=min
  input.max=max
  input.value=value
  input.id=name

  input.addEventListener("input",(event)=>{
    filters[name].value=input.value
    applyFilter()
  })

  const p=document.createElement("p")
  p.innerText=name

  div.appendChild(p)
  div.appendChild(input)

  return div
}

Object.keys(filters).forEach(key=>{
    const filterElement=createFilterElement(key,filters[key].unit,filters[key].value,filters[key].min,filters[key].max)
    filterContainer.appendChild(filterElement)
})

imageInput.addEventListener("change",(e)=>{
    file=e.target.files[0]
    
    if(!file) return;
    
    img=new Image()
    img.src=URL.createObjectURL(file)
    const imagePlaceHolder=document.querySelector(".placeholder")
    imagePlaceHolder.style.display="none"
    
    img.onload=()=>{
        canvasImage.width=img.width
        canvasImage.height=img.height
        canvasImage.style.display="block" // Show canvas
        applyFilter() // Apply filters on load
    }
})

function applyFilter(){
    
    if(!img) return;
    
    // Clear canvas
    canvasCtx.clearRect(0, 0, canvasImage.width, canvasImage.height);
    
    
    canvasCtx.globalAlpha = filters.opacity.value / 100;
    
    
    canvasCtx.filter=`brightness(${filters.brightness.value}${filters.brightness.unit}) contrast(${filters.contrast.value}${filters.contrast.unit}) saturate(${filters.saturation.value}${filters.saturation.unit}) hue-rotate(${filters.huerotation.value}${filters.huerotation.unit}) blur(${filters.blur.value}${filters.blur.unit}) grayscale(${filters.grayscale.value}${filters.grayscale.unit}) sepia(${filters.sepia.value}${filters.sepia.unit}) invert(${filters.invert.value}${filters.invert.unit})`
    
    canvasCtx.drawImage(img,0,0)
    
   
    canvasCtx.globalAlpha = 1;
}

Reset.addEventListener("click",()=>{
    
    if(!img) return;
    
    // Reset filter values
    filters.brightness.value = 100;
    filters.contrast.value = 100;
    filters.exposure.value = 100;
    filters.saturation.value = 100;
    filters.huerotation.value = 0;
    filters.blur.value = 0;
    filters.grayscale.value = 0;
    filters.sepia.value = 0;
    filters.opacity.value = 100;
    filters.invert.value = 0;
    
    Object.keys(filters).forEach(key => {
        const slider = document.querySelector(`#${key}`);
        if(slider) {
            slider.value = filters[key].value;
        }
    });
    
    applyFilter();
})

download.addEventListener("click",()=>{
    // Check if image exists before downloading
    if(!img) {
        alert("Please upload an image first!");
        return;
    }
    
    const link=document.createElement("a")
    link.download="edited-image.png"
    link.href=canvasImage.toDataURL()
    link.click()
})