import { toast } from "sonner"

const DashboardPage = () => {
  return (
    <div>
      <button onClick={()=>toast.success('product added succesfully')} className="btn btn-accent m-4">show toast</button>
    </div>
  )
}

export default DashboardPage