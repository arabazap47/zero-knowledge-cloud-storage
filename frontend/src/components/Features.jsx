import { Sparkles, GitBranch, BarChart3, Workflow } from "lucide-react"
import ScrollReveal from "./ScrollReveal"

export default function Features(){

const features=[

{
icon:<Sparkles/>,
title:"AI Form Generation",
desc:"Instantly create forms using natural language."
},

{
icon:<GitBranch/>,
title:"Logic & Branching",
desc:"Dynamic conditional workflows."
},

{
icon:<BarChart3/>,
title:"Real-time Analytics",
desc:"Instant insights from responses."
},

{
icon:<Workflow/>,
title:"Workflow Integrations",
desc:"Connect Slack, Salesforce and more."
}

]

return(

<section id="features" className="container py-24 scroll-mt-28">
<ScrollReveal>
<h2 className="text-3xl font-bold text-center mb-14">
Platform Features
</h2>
</ScrollReveal>
<ScrollReveal>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

{features.map((f,i)=>(
<div
key={i}
className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 shadow hover:shadow-xl hover:-translate-y-2 transition"
>

<div className="text-purple-600 mb-4">
{f.icon}
</div>

<h3 className="font-semibold text-lg">
{f.title}
</h3>

<p className="text-gray-500 mt-2 text-sm">
{f.desc}
</p>

</div>

))}

</div>
</ScrollReveal>

</section>

)
}