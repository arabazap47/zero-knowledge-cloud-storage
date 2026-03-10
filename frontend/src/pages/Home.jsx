import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import UseCases from "../components/Usecases"
import CTA from "../components/CTA"
import Footer from "../components/Footer"
import HowItWorks from "../components/HowItWorks"
import Pricing from "../components/Pricing"
import Resources from "../components/Resources"

export default function Home(){

return(

<div className="w-full">

<Navbar/>
<Hero/>
<Features/>
<UseCases/>
<Pricing />
<HowItWorks />
<Resources />
<CTA/>
<Footer/>

</div>

)
}