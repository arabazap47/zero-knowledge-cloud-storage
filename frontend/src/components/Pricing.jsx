export default function Pricing() {

const plans = [
{
name: "Free",
price: "$0",
features: [
"3 Forms",
"100 Responses / month",
"Basic Analytics",
"Share via link",
],
highlight:false
},

{
name: "Pro",
price: "$19",
features: [
"Unlimited Forms",
"10,000 Responses",
"Advanced Analytics",
"AI Insights",
"Multi-channel distribution",
],
highlight:true
},

{
name: "Enterprise",
price: "Custom",
features: [
"Unlimited everything",
"AI response analysis",
"Team collaboration",
"Custom integrations",
"Priority support"
],
highlight:false
}
]

return(

<section id="pricing" className="container py-24 mt-24 scroll-mt-32">

<h2 className="text-3xl font-bold text-center mb-16">
Pricing
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

{plans.map((plan,i)=>(

<div
key={i}
className={`p-8 rounded-lg border transition hover:shadow-lg 
${plan.highlight 
? "bg-gradient-to-br from-purple-500 to-blue-500 text-white scale-105" 
: "bg-white"}
`}
>

<h3 className="text-xl font-semibold">
{plan.name}
</h3>

<p className="text-4xl font-bold mt-3">
{plan.price}
</p>

<ul className="mt-6 space-y-2 text-sm">

{plan.features.map((f,index)=>(
<li key={index}>• {f}</li>
))}

</ul>

<button
className={`mt-6 w-full py-2 rounded-md font-medium
${plan.highlight
? "bg-white text-purple-600"
: "bg-purple-600 text-white"}
`}
>
Get Started
</button>

</div>

))}

</div>

</section>

)
}