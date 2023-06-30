import { ElMessageBox } from "element-plus"
const Confirm=(message,okfun)=>{
  ElMessageBox.confirm(message,'提示',{
    'cancel-button-text':'确定',
    'cancel-button-class':'取消',
    'type':'info'
  }).then(async()=>{
    okfun()
  }).catch(()=>{

  })
}
export default Confirm