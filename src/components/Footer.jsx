/* eslint-disable */

import React from "react";

const Footer = () => {
  return (

<footer className="w-full bg-gradient-to-r from-indigo-700 to-indigo-600 text-white mt-12">

<div className="max-w-6xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-4">

{/* Column 1 */}

<div>

<div className="text-lg font-semibold">
Suraksha Sathi
</div>

<p className="text-sm mt-2 text-indigo-100">

Empowering safe mobility for women using community reports, live insights and SOS alerts.

</p>

<div className="text-xs text-indigo-200 mt-4">

Built by students • Demo Prototype

</div>

</div>


{/* Column 2 */}

<div>

<div className="font-semibold mb-2">
Quick Links
</div>

<ul className="space-y-1 text-sm">

<li>Home</li>
<li>Route Finder</li>
<li>Community</li>
<li>About</li>

</ul>

</div>


{/* Column 3 */}

<div>

<div className="font-semibold mb-2">
Resources
</div>

<ul className="space-y-1 text-sm">

<li>OpenStreetMap</li>
<li>OSRM Routing</li>
<li>Privacy & Terms</li>

</ul>

</div>


{/* Column 4 */}

<div>

<div className="font-semibold mb-2">
Contact
</div>

<div className="text-sm text-indigo-100">
Email: hello@surakshasathi.com
</div>

<div className="text-sm text-indigo-100 mt-2">
Phone: +91 12345 67890
</div>

</div>

</div>


{/* Bottom */}

<div className="border-t border-indigo-600/50">

<div className="max-w-6xl mx-auto px-6 py-3 flex justify-between text-xs text-indigo-200">

<div>
© 2026 Suraksha Sathi
</div>

<div>
Made with ❤
</div>

</div>

</div>

</footer>

  );
};

export default Footer;