export default function Resources(){

    return(
        <section id="resources" className="container py-24">

<h2 className="text-3xl font-bold text-center mb-16">
Resources
</h2>

<div className="grid md:grid-cols-3 gap-8">

<div className="p-6 border rounded-lg">
<h3 className="font-semibold">Documentation</h3>
<p className="text-gray-500 mt-2">
Learn how to use IntelliForm features.
</p>
</div>

<div className="p-6 border rounded-lg">
<h3 className="font-semibold">Templates</h3>
<p className="text-gray-500 mt-2">
Start with ready-made forms.
</p>
</div>

<div className="p-6 border rounded-lg">
<h3 className="font-semibold">API Docs</h3>
<p className="text-gray-500 mt-2">
Integrate IntelliForm with your apps.
</p>
</div>

</div>

</section>
    )
}