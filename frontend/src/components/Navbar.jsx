import { Menu, X, Sparkles } from "lucide-react"
import { useState } from "react"

export default function Navbar(){

const [open,setOpen]=useState(false)

return(

<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">

<div className="max-w-[1280px] mx-auto px-6 flex justify-between items-center py-4">

{/* Logo */}
<a href="#home" className="flex items-center gap-2 font-bold text-xl">
<Sparkles className="text-purple-600"/>
FormAI
</a>

{/* Desktop Menu */}
<div className="hidden md:flex gap-8 text-gray-600 font-medium">
<a href="#features" className="hover:text-purple-600 transition">Features</a>
<a href="#usecases" className="hover:text-purple-600 transition">Use Cases</a>
<a href="#pricing" className="hover:text-purple-600 transition">Pricing</a>
<a href="#resources" className="hover:text-purple-600 transition">Resources</a>
</div>

{/* Desktop Buttons */}
<div className="hidden md:flex gap-4 items-center">

<button className="text-gray-700 hover:text-purple-600">
Log in
</button>

<button className="px-5 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow-md hover:opacity-90 transition">
Sign Up Free
</button>

</div>

{/* Mobile Menu Button */}
<button
className="md:hidden"
onClick={()=>setOpen(!open)}
>
{open ? <X size={24}/> : <Menu size={24}/>}
</button>

</div>

{/* Mobile Menu */}
{open && (

<div className="md:hidden bg-white border-t">

<div className="flex flex-col items-center gap-6 py-6 text-gray-700">

<a href="#features" onClick={()=>setOpen(false)}>Features</a>

<a href="#usecases" onClick={()=>setOpen(false)}>Use Cases</a>

<a href="#pricing" onClick={()=>setOpen(false)}>Pricing</a>

<a href="#resources" onClick={()=>setOpen(false)}>Resources</a>

<button className="text-gray-700">
Log in
</button>

<button className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-blue-500">
Sign Up Free
</button>

</div>

</div>

)}

</nav>

)
}