import { motion } from "framer-motion";

export default function Hero() {

return(

<motion.section
id="home"
initial={{ opacity:0 }}
animate={{ opacity:1 }}
transition={{ duration:0.6 }}
className="relative pt-24 mb-54 text-center"
>

{/* Gradient background */}
<div
className="absolute inset-0 -z-10"
style={{
background: `
radial-gradient(circle at 30% 20%, rgba(168,85,247,0.25), transparent 40%),
radial-gradient(circle at 80% 30%, rgba(59,130,246,0.25), transparent 40%),
linear-gradient(to bottom, #ffffff, #f5f3ff 40%, #eff6ff)
`
}}
></div>

{/* Glow blobs */}
{/* <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-purple-300 rounded-full blur-[120px] opacity-30"></div>

<div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-blue-300 rounded-full blur-[120px] opacity-30"></div> */}


{/* Hero content container */}
<div className="max-w-5xl mx-auto px-6">

<motion.h1
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
className="text-4xl md:text-6xl font-bold leading-tight"
>
Create Smart Forms in
<br/>
Seconds with AI
</motion.h1>

<p className="text-gray-500 mt-6 text-lg max-w-xl mx-auto">
The intelligent way to build, deploy, and analyze forms without coding.
</p>

<motion.button
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ delay: 0.5 }}
className="mt-8 px-8 py-3 text-white rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:scale-105 transition"
>
Get Started - It's Free
</motion.button>

</div>

{/* Preview image */}
<div className="flex justify-center mt-20 px-6 relative z-10">

<img
src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg"
className="rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] w-full max-w-[900px] -mb-32"
/>

</div>

</motion.section>

)
}