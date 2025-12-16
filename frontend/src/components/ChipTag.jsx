export default function ChipTag(props) {
  
  const handleCapitalizeEachFirstLetter = (text) => {
    let words = text.split(" ");
    for(let i=0; i<words.length; i++){
      words[i] = words[i].charAt(0).toUpperCase()+words[i].substring(1).toLowerCase();
    }
    text = (words.join(" "));
    return text;
  }

  return (
    <button className={`chip ${props.selectedTag===props.tag?"chip-active":""}`} onClick={()=>{if(props.selectedTag===props.tag){props.handleSelectTag("")}else{props.handleSelectTag(props.tag)}}}>{handleCapitalizeEachFirstLetter(props.tag)}</button>
  )
}