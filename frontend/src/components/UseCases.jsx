import { Megaphone, Users, Calendar, Settings } from "lucide-react"
import { motion } from "framer-motion"

export default function UseCases(){

const cases=[
{
icon:<Megaphone size={28}/>,
title:"Lead Generation",
desc:["Increase marketing ROI","Qualify leads faster"],
gradient:"from-purple-100 to-blue-100"
},

{
icon:<Users size={28}/>,
title:"Customer Feedback",
desc:["Improve products","Gauge satisfaction"],
gradient:"from-blue-100 to-purple-100"
},

{
icon:<Calendar size={28}/>,
title:"Event Registration",
desc:["Manage attendees","Seamless sign-ups"],
gradient:"from-purple-100 to-blue-100"
},

{
icon:<Settings size={28}/>,
title:"Internal HR Forms",
desc:["Streamline onboarding","Collect employee data"],
gradient:"from-blue-100 to-indigo-100"
}
]

return(

<section id="usecases" className="container py-24 mt-24 scroll-mt-32">

{/* Section Title Animation */}
<motion.h2
initial={{ opacity:0, y:40 }}
whileInView={{ opacity:1, y:0 }}
transition={{ duration:0.6 }}
viewport={{ once:true }}
className="text-3xl font-bold text-center mb-14"
>
Use Cases
</motion.h2>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

{cases.map((item,i)=>(
<motion.div
key={i}
initial={{ opacity:0, y:50 }}
whileInView={{ opacity:1, y:0 }}
transition={{ duration:0.5, delay: i * 0.2 }}
viewport={{ once:true }}
className={`p-6 rounded-lg shadow-sm bg-gradient-to-br ${item.gradient} hover:shadow-lg hover:-translate-y-1 transition`}
>

<div className="text-purple-600 mb-4">
{item.icon}
</div>

<h3 className="font-semibold text-lg">
{item.title}
</h3>

<ul className="text-gray-500 text-sm mt-2 space-y-1">
{item.desc.map((d,index)=>(
<li key={index}>• {d}</li>
))}
</ul>

</motion.div>
))}

</div>

</section>

)
}