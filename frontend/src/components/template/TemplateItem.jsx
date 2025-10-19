export default function DrawingItem(props) {

  const { template_title, template_tag, image_url, date } = props.templateInfo;

  return (
    <div>
      <h1>{template_title}</h1>
      <p>{template_tag}</p>
      <p>{date}</p>
      <img src={image_url} style={{height: "120px", width: "200px"}}/>
    </div>
  )
}
