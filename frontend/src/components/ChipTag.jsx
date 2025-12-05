export default function ChipTag(props) {
  return (
    <button className={`chip ${props.selectedTag===props.tag?"chip-active":""}`} onClick={()=>{if(props.selectedTag===props.tag){props.handleSelectTag("")}else{props.handleSelectTag(props.tag)}}}>{props.tag.charAt(0).toUpperCase()+props.tag.substring(1).toLowerCase()}</button>
  )
}