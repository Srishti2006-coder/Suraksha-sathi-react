
const Home = () => {
  return (

<section className="bg-gray-100 min-h-screen py-16">

<div className="max-w-6xl mx-auto px-4">


{/* HERO */}

<div className="grid lg:grid-cols-2 gap-10 items-center">


<div>

<h1 className="text-4xl font-extrabold text-gray-900 leading-tight">

Turning every journey into a safer experience.

</h1>


<p className="mt-4 text-gray-600 max-w-xl">

Find safer paths home using community reports, live safety insights and instant SOS alerts.

</p>


<div className="mt-6 flex gap-4">


<button className="bg-black text-white px-6 py-3 rounded-lg font-semibold shadow hover:shadow-xl transition">

Find Safe Routes

</button>


<button className="border border-gray-400 px-6 py-3 rounded-lg hover:bg-gray-200 transition">

Report an Unsafe Area

</button>


</div>


<div className="mt-6 flex gap-8 text-sm text-gray-600">


<div className="bg-white px-4 py-2 rounded-lg shadow">

120+ safe reports

</div>


<div className="bg-white px-4 py-2 rounded-lg shadow">

Designed for all

</div>


<div className="bg-white px-4 py-2 rounded-lg shadow">

Real-time updates

</div>


</div>


</div>



{/* MAP */}

<div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition">


<img

src="https://tse3.mm.bing.net/th/id/OIP.AwGLbTTaDMYL_nC7xmpTeAHaHa?pid=Api&P=0&h=180"

alt="Map"

className="w-full h-80 object-cover"

/>


</div>


</div>



{/* FEATURES */}

<div className="mt-20">


<h2 className="text-2xl font-bold text-gray-800 text-center mb-10">

Features

</h2>


<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">


{[

"Safe Route Finder",

"SOS Panic Button",

"Community Reports",

"Privacy First"

].map((item,index)=> (


<div

key={index}

className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-2 transition duration-300"

>


<h3 className="font-semibold text-gray-800">

{item}

</h3>


<p className="text-sm text-gray-500 mt-2">

A secure and reliable platform to improve safety.

</p>


</div>


))}


</div>


</div>



{/* INFO SECTION */}

<div className="mt-20 grid md:grid-cols-3 gap-6">


<div className="bg-white p-8 rounded-xl shadow text-center">

<h2 className="text-3xl font-bold text-gray-900">

120+

</h2>

<p className="text-gray-600">

Safe Reports

</p>

</div>



<div className="bg-white p-8 rounded-xl shadow text-center">

<h2 className="text-3xl font-bold text-gray-900">

24/7

</h2>

<p className="text-gray-600">

Safety Monitoring

</p>

</div>



<div className="bg-white p-8 rounded-xl shadow text-center">

<h2 className="text-3xl font-bold text-gray-900">

Live

</h2>

<p className="text-gray-600">

Location Tracking

</p>

</div>


</div>



{/* LAST SECTION */}

<div className="mt-20 text-center">


<h2 className="text-3xl font-bold text-gray-900">

Stay Safe Always

</h2>


<p className="text-gray-600 mt-3">

Technology that protects you on every journey.

</p>


<button className="mt-6 bg-black text-white px-8 py-3 rounded-lg shadow hover:shadow-xl transition">

Get Started

</button>


</div>


</div>

</section>

  );
};

export default Home;