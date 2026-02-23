import React from "react";

const Home = () => {

return (

<section className="bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen pt-28 pb-16 text-white">

<div className="max-w-6xl mx-auto px-4">


{/* HERO */}

<div className="grid lg:grid-cols-2 gap-10 items-center">


<div>

<h1 className="text-5xl font-extrabold leading-tight">

Turning every journey into a safer experience.

</h1>


<p className="mt-5 text-indigo-100 text-lg">

Find safer paths home using community reports, live safety insights and instant SOS alerts.

</p>


<div className="mt-8 flex gap-4">


<button className="bg-white text-indigo-600 px-7 py-3 rounded-lg font-semibold shadow hover:shadow-xl">

Find Safe Routes

</button>


<button className="border border-white px-7 py-3 rounded-lg hover:bg-white hover:text-indigo-600">

Report an Unsafe Area

</button>


</div>



<div className="mt-8 flex gap-6">


<div className="bg-white/20 px-5 py-3 rounded-lg">

120+ safe reports

</div>

<div className="bg-white/20 px-5 py-3 rounded-lg">

Designed for all

</div>

<div className="bg-white/20 px-5 py-3 rounded-lg">

Real-time updates

</div>


</div>

</div>



{/* IMAGE */}

<div className="rounded-2xl overflow-hidden shadow-2xl">

<img

src="https://tse3.mm.bing.net/th/id/OIP.AwGLbTTaDMYL_nC7xmpTeAHaHa?pid=Api&P=0&h=180"

className="w-full h-96 object-cover"

/>

</div>


</div>



{/* FEATURES */}

<div className="mt-24">


<h2 className="text-3xl font-bold text-center mb-12">

Features

</h2>


<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">


{[

"Safe Route Finder",

"SOS Panic Button",

"Community Reports",

"Privacy First"

].map((item,index)=>(

<div
key={index}
className="bg-white text-gray-800 p-7 rounded-xl shadow hover:shadow-2xl transition"
>

<h3 className="font-bold text-lg">

{item}

</h3>

<p className="text-gray-500 mt-3">

A secure and reliable platform to improve safety.

</p>

</div>

))}


</div>

</div>



{/* STATS */}

<div className="mt-24 grid md:grid-cols-3 gap-6">


<div className="bg-white text-gray-800 p-8 rounded-xl text-center shadow">

<h2 className="text-4xl font-bold">

120+

</h2>

<p>

Safe Reports

</p>

</div>



<div className="bg-white text-gray-800 p-8 rounded-xl text-center shadow">

<h2 className="text-4xl font-bold">

24/7

</h2>

<p>

Safety Monitoring

</p>

</div>



<div className="bg-white text-gray-800 p-8 rounded-xl text-center shadow">

<h2 className="text-4xl font-bold">

Live

</h2>

<p>

Location Tracking

</p>

</div>


</div>



{/* CTA */}

<div className="mt-24 text-center">


<h2 className="text-4xl font-bold">

Stay Safe Always

</h2>


<p className="mt-4 text-indigo-100">

Technology that protects you on every journey.

</p>


<button className="mt-6 bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold shadow">

Get Started

</button>


</div>


</div>

</section>

);

};

export default Home;