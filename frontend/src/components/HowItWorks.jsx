export default function HowItWorks(){

const steps = [
{
title:"Describe Your Form",
desc:"Just type what you need and let AI generate it."
},
{
title:"Customize Content",
desc:"Edit fields and apply branding."
},
{
title:"Publish & Share",
desc:"Deploy instantly via link or embed."
}
]

return(

<section className="py-20 px-10 text-center">

<h2 className="text-3xl font-bold mb-10">
How It Works
</h2>

<div className="grid md:grid-cols-3 gap-6">

{steps.map((step,index)=>(
<div key={index} className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold">
{step.title}
</h3>

<p className="text-gray-500 mt-2 text-sm">
{step.desc}
</p>

</div>
))}

</div>

</section>
)
}