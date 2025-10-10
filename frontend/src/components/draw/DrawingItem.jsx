export default function DrawingItem(props) {

  const { drawing_title, drawing_tag, drawing_url, date } = props.drawingInfo;

  return (
    <div>
      <h1>{drawing_title}</h1>
      <p>{drawing_tag}</p>
      <p>{date}</p>
      <img src={drawing_url} style={{height: "120px", width: "200px"}}/>
    </div>
  )
}
