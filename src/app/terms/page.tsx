import React from "react";
import Link from "next/link";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Multiplier Ltd trading as EatUP!</h1>
          <div className="flex justify-between text-gray-600">
            <h2 className="font-medium">Website Terms & Conditions</h2>
            <p>Monday 16 December 2024</p>
          </div>
        </div>

        {/* Background */}
        <section className="mb-8">
          <h2 className="font-bold mb-4">BACKGROUND:</h2>
          <p className="text-gray-700 leading-relaxed">
            This agreement applies as between you, the User of this Web Site and Multiplier Ltd, the owner(s) of this Web Site. Your agreement to comply with and be bound by these terms and conditions is deemed to occur upon your first use of the Web Site. If you do not agree to be bound by these terms and conditions, you should stop using the Web Site immediately.
          </p>
        </section>

        {/* Definitions */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">1. Definitions and Interpretation</h2>
          <p className="mb-4">In this Agreement the following terms shall have the following meanings:</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="font-medium">"Content"</div>
              <div className="md:col-span-3">means any text, graphics, images, audio, video, software, data compilations and any other form of information capable of being stored in a computer that appears on or forms part of this Web Site;</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="font-medium">"Multiplier Ltd"</div>
              <div className="md:col-span-3">means Multiplier Ltd trading as EatUP! 71-75 Shelton Street, London, England, WC2H 9JQ;</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="font-medium">"Service"</div>
              <div className="md:col-span-3">means collectively any online facilities, tools, services or information that Multiplier Ltd makes available through the Web Site either now or in the future;</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="font-medium">"System"</div>
              <div className="md:col-span-3">means any online communications infrastructure that Multiplier Ltd makes available through the Web Site either now or in the future. This includes, but is not limited to, web-based email, message boards, live chat facilities and email links;</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="font-medium">"User" / "Users"</div>
              <div className="md:col-span-3">means any third party that accesses the Web Site and is not employed by Multiplier Ltd and acting in the course of their employment;</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="font-medium">"Web Site"</div>
              <div className="md:col-span-3">means the website that you are currently using (https://www.eatup.co/) and any sub-domains of this site unless expressly excluded by their own terms and conditions.</div>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">2. Intellectual Property</h2>
          <div className="space-y-4">
            <p className="text-gray-700">2.1 All Content included on the Web Site, unless uploaded by Users, including, but not limited to, text, graphics, logos, icons, images, sound clips, video clips, data compilations, page layout, underlying code and software is the property of Multiplier Ltd our affiliates or other relevant third parties. By continuing to use the Web Site you acknowledge that such material is protected by applicable United Kingdom and International intellectual property and other relevant laws.</p>
            <p className="text-gray-700">2.2 Subject to sub-clause 2.3 you may not reproduce, copy, distribute, store or in any other fashion re-use material from the Web Site unless otherwise indicated on the Web Site or unless given express written permission to do so by Multiplier Ltd.</p>
            <p className="text-gray-700">2.3 Material from the Web Site may be re-used without written permission where any of the exceptions detailed in Chapter III of the Copyright Designs and Patents Act 1988 apply.</p>
          </div>
        </section>

        {/* Links to Other Web Sites */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">3. Links to Other Web Sites</h2>
          <p className="text-gray-700">
            This Web Site may contain links to other sites. Unless expressly stated, these sites are not under the control of Multiplier Ltd or that of our affiliates. We assume no responsibility for the content of such web sites and disclaim liability for any and all forms of loss or damage arising out of the use of them. The inclusion of a link to another site on this Web Site does not imply any endorsement of the sites themselves or of those in control of them.
          </p>
        </section>

        {/* Links to this Web Site */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">4. Links to this Web Site</h2>
          <p className="text-gray-700">
            Those wishing to place a link to this Web Site on other sites may do so only to the home page of the site https://www.eatup.co/ without prior permission. Deep linking (i.e. links to specific pages within the site) requires the express permission of Multiplier Ltd. To find out more please contact us by email at george@multiplier.info or by post to 71-75 Shelton Street, London, England, WC2H 9JQ.
          </p>
        </section>

        {/* Privacy */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">5. Privacy</h2>
          <div className="space-y-4">
            <p className="text-gray-700">5.1 For the purposes of applicable data protection legislation, the Multiplier Ltd will process any personal data you have provided to it in accordance Privacy Policy available on the Multiplier Ltd website or on request from Multiplier Ltd.</p>
            <p className="text-gray-700">5.2 You agree that, if you have provided Multiplier Ltd with personal data relating to a third party (1) you have in place all necessary appropriate consents and notices to enable lawful transfer such personal data to Multiplier Ltd and (2) that you have brought to the attention of any such third party the Privacy Notice available on the Multiplier Ltd's website or otherwise provided a copy of it to the third party. You agree to indemnify Multiplier Ltd in relation to all and any liabilities, penalties, fines, awards or costs arising from your non-compliance with these requirements.</p>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">6. Disclaimers</h2>
          <div className="space-y-4">
            <p className="text-gray-700">6.1 Multiplier Ltd makes no warranty or representation that the Web Site will meet your requirements, that it will be of satisfactory quality, that it will be fit for a particular purpose, that it will not infringe the rights of third parties, that it will be compatible with all systems, that it will be secure and that all information provided will be accurate. We make no guarantee of any specific results from the use of our Service.</p>
            <p className="text-gray-700">6.2 No part of this Web Site is intended to constitute advice and the Content of this Web Site should not be relied upon when making any decisions or taking any action of any kind.</p>
          </div>
        </section>

        {/* Availability */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">7. Availability of the Web Site</h2>
          <div className="space-y-4">
            <p className="text-gray-700">The Service is provided "as is" and on an "as available" basis. We give no warranty that the Service will be free of defects and / or faults. To the maximum extent permitted by the law we provide no warranties (express or implied) of fitness for a particular purpose, accuracy of information, compatibility and satisfactory quality.</p>
            <p className="text-gray-700">Multiplier Ltd accepts no liability for any disruption or non-availability of the Web Site resulting from external causes including, but not limited to, ISP equipment failure, host equipment failure, communications network failure, power failure, natural events, acts of war or legal restrictions and censorship.</p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">8. Limitation of Liability</h2>
          <div className="space-y-4">
            <p className="text-gray-700">8.1 To the maximum extent permitted by law, Multiplier Ltd accepts no liability for any direct or indirect loss or damage, foreseeable or otherwise, including any indirect, consequential, special or exemplary damages arising from the use of the Web Site or any information contained therein. Users should be aware that they use the Web Site and its Content at their own risk.</p>
            <p className="text-gray-700">8.2 Nothing in these terms and conditions excludes or restricts Multiplier Ltd's liability for death or personal injury resulting from any negligence or fraud on the part of Multiplier Ltd.</p>
            <p className="text-gray-700">8.3 Every effort has been made to ensure that these terms and conditions adhere strictly with the relevant provisions of the Unfair Contract Terms Act 1977. However, in the event that any of these terms are found to be unlawful, invalid or otherwise unenforceable, that term is to be deemed severed from these terms and conditions and shall not affect the validity and enforceability of the remaining terms and conditions. This term shall apply only within jurisdictions where a particular term is illegal.</p>
          </div>
        </section>

        {/* No Waiver */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">9. No Waiver</h2>
          <p className="text-gray-700">
            In the event that any party to these Terms and Conditions fails to exercise any right or remedy contained herein, this shall not be construed as a waiver of that right or remedy.
          </p>
        </section>

        {/* Previous Terms */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">10. Previous Terms and Conditions</h2>
          <p className="text-gray-700">
            In the event of any conflict between these Terms and Conditions and any prior versions thereof, the provisions of these Terms and Conditions shall prevail unless it is expressly stated otherwise.
          </p>
        </section>

        {/* Notices */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">11. Notices</h2>
          <p className="text-gray-700">
            All notices / communications shall be given to us either by post to our Premises (see address above) or by email george@multiplier.info. Such notice will be deemed received 3 days after posting if sent by first class post, the day of sending if the email is received in full on a business day and on the next business day if the email is sent on a weekend or public holiday.
          </p>
        </section>

        {/* Law and Jurisdiction */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">12. Law and Jurisdiction</h2>
          <p className="text-gray-700">
            These terms and conditions and the relationship between you and Multiplier Ltd shall be governed by and construed in accordance with the Law of England and Wales and Multiplier Ltd and you agree to submit to the exclusive jurisdiction of the Courts of England and Wales.
          </p>
        </section>

        {/* Back to Home */}
        <div className="mt-12 border-t pt-8">
          <Link href="/" className="text-primary hover:text-primary-dark transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
