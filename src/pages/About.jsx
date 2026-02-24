const About = ({ setPage }) => {

return (

<section className="min-h-screen bg-gray-100 py-16">

<div className="max-w-6xl mx-auto px-4 space-y-12">


{/* HERO */}

<div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl p-10 shadow-lg">

<h2 className="text-3xl font-bold">

Suraksha Sathi — Safer journeys for women

</h2>

<p className="mt-4 text-indigo-100 max-w-2xl">

We combine community reports, live safety insights and instant SOS
to help women choose safer routes. Simple, reliable and
community-driven.

</p>

<div className="mt-6 flex gap-4">

<button
onClick={()=>setPage("route")}
className="bg-white text-indigo-600 px-5 py-3 rounded-lg font-semibold shadow"
>

Find Safe Routes

</button>


<button
onClick={()=>setPage("community")}
className="border border-white px-5 py-3 rounded-lg"
>

View Reports

</button>

</div>

</div>



{/* MISSION VISION */}

<div className="grid md:grid-cols-2 gap-6">


<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-indigo-600 font-semibold">

Our Mission

</h3>

<p className="mt-3 text-gray-600">

Help women travel confidently by providing safer route suggestions.

</p>


<ul className="mt-4 text-gray-600 space-y-2">

<li>• Real-time reports</li>

<li>• Safety scoring</li>

<li>• Easy SOS</li>

</ul>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-indigo-600 font-semibold">

Our Vision

</h3>

<p className="mt-3 text-gray-600">

A world where public spaces feel safe for everyone.

</p>


<p className="mt-3 text-gray-600">

Future goal: Integration with city data.

</p>

</div>


</div>



{/* STORY */}

<div className="bg-indigo-50 p-8 rounded-xl">

<h3 className="font-semibold text-indigo-700">

Our Story

</h3>


<p className="mt-3 text-gray-600">

Suraksha Sathi began as a hackathon project: students who felt unsafe walking home wanted a simple tool to surface safer paths. We built a prototype, tested with peers and iterated based on real feedback from the community.Judges praised the clarity and real-world utility — we focused on reliability and ease of reporting.


</p>

</div>



{/* FEATURES */}

<div>

<h2 className="text-2xl font-bold text-center mb-8">

Features

</h2>


<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">


{[

["🗺️","Safe Routes"],

["🚨","SOS Alerts"],

["📣","Reports"],

["🔒","Privacy"]

].map((item,index)=>(


<div
key={index}
className="bg-white p-6 rounded-xl shadow text-center hover:shadow-xl transition"
>

<div className="text-3xl">

{item[0]}

</div>

<h3 className="mt-3 font-semibold">

{item[1]}

</h3>

<p className="text-gray-500 text-sm mt-2">

Reliable safety features

</p>


</div>

))}


</div>

</div>



{/* TEAM */}

<div className="bg-white p-8 rounded-xl shadow">


<h3 className="text-xl font-semibold text-indigo-600">

Meet the Team

</h3>


<div className="mt-6 grid sm:grid-cols-3 gap-6">


{[

["SB","Srishti","Frontend"],

["SJ","Shreya","Backend"],

["SJ","Sejal","Design"]

].map((t,index)=>(


<div
key={index}
className="flex items-center gap-4"
>

<div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">

{t[0]}

</div>


<div>

<div className="font-semibold">

{t[1]}

</div>


<div className="text-sm text-gray-500">

{t[2]}

</div>

</div>


</div>

))}


</div>

</div>



{/* STATS */}

<div className="grid sm:grid-cols-3 gap-6">


<div className="bg-indigo-600 text-white p-8 rounded-xl text-center">

<h2 className="text-3xl font-bold">

1200+

</h2>

<p>

Safe Routes

</p>

</div>


<div className="bg-pink-500 text-white p-8 rounded-xl text-center">

<h2 className="text-3xl font-bold">

300+

</h2>

<p>

Reports

</p>

</div>



<div className="bg-green-500 text-white p-8 rounded-xl text-center">

<h2 className="text-3xl font-bold">

40+

</h2>

<p>

SOS Alerts

</p>

</div>


</div>



{/* CONTACT */}

<div className="bg-white p-8 rounded-xl shadow">


<h3 className="text-xl font-semibold text-indigo-600">

Contact Us

</h3>


<div className="grid md:grid-cols-2 gap-6 mt-6">


<div>

<p className="text-gray-600">

Want to collaborate?

</p>


<button className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg">

Email Us

</button>


</div>



<div>


<input
placeholder="Name"
className="w-full border p-3 rounded mb-3"
/>


<input
placeholder="Email"
className="w-full border p-3 rounded mb-3"
/>


<textarea
placeholder="Message"
className="w-full border p-3 rounded"
/>


<button className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg">

Send

</button>


</div>


</div>

</div>


</div>


{/* FOOTER ADD KIYA */}

<footer className="bg-indigo-700 text-white mt-16">

<div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">


<div>

<h3 className="font-bold">

Suraksha Sathi

</h3>

<p className="text-sm mt-2">

Empowering safe mobility for women.

</p>

</div>



<div>

<h3 className="font-bold">

Quick Links

</h3>

<p onClick={()=>setPage("home")} className="cursor-pointer">

Home

</p>

<p onClick={()=>setPage("route")} className="cursor-pointer">

Route

</p>

<p onClick={()=>setPage("community")} className="cursor-pointer">

Community

</p>

</div>



<div>

<h3 className="font-bold">

Resources

</h3>

<p>

Safety Tips

</p>

<p>

Privacy

</p>

</div>



<div>

<h3 className="font-bold">

Contact

</h3>

<p>

hello@suraksha.com

</p>

<p>

+91 9876543210

</p>

</div>


</div>


<div className="text-center pb-6 text-sm">

© 2026 Suraksha Sathi

</div>


</footer>



</section>

);

};

export default About;