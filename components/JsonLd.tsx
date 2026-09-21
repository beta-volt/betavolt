import React from 'react';

interface JsonLdProps {
  locale: 'ar' | 'en';
}

/**
 * 🏛️ Schema.org Structured Data Injector for BetaVolt
 *
 * Implements Google-compliant JSON-LD markup for:
 * 1. Organization & GeneralContractor / Electrician
 * 2. Specialized B2B Engineering Services (Data Centers, BMS, Low Current)
 * 3. BreadcrumbList for Rich Snippets
 */
export default function JsonLd({ locale }: JsonLdProps) {
  const isAr = locale === 'ar';
  const baseUrl = 'https://www.betavolt.com.sa';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${baseUrl}/#organization`,
    name: isAr
      ? 'شركة بيتافولت للمقاولات الكهروميكانيكية والأنظمة الذكية'
      : 'BetaVolt Contracting Co. — Electromechanical & Smart Systems',
    alternateName: ['BetaVolt', 'بيتافولت', 'بيتافولت للمقاولات'],
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/og-image.jpg`,
    description: isAr
      ? 'شركة رائدة في مقاولات مراكز البيانات (Tier III/IV)، وأنظمة التحكم الذكي والمباني (BMS)، والتيار الخفيف، والشبكات الكهربائية في المملكة العربية السعودية.'
      : 'Leading Saudi B2B contractor specializing in Tier III/IV Data Centers, Building Management Systems (BMS), Low Current ELV infrastructure, and electrical engineering.',
    email: 'inquiries@betavolt.com.sa',
    address: {
      '@type': 'PostalAddress',
      addressLocality: isAr ? 'الرياض' : 'Riyadh',
      addressRegion: isAr ? 'منطقة الرياض' : 'Riyadh Region',
      addressCountry: 'SA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '24.7136',
      longitude: '46.6753',
    },
    areaServed: [
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'City', name: 'Riyadh' },
      { '@type': 'City', name: 'Jubail' },
      { '@type': 'City', name: 'NEOM' },
      { '@type': 'City', name: 'Dammam' },
      { '@type': 'City', name: 'Jeddah' },
    ],
    knowsAbout: [
      'Data Center MEP Infrastructure',
      'Building Management Systems (BMS)',
      'SCADA & Industrial Automation',
      'Low Current (ELV) Systems',
      'CCTV & Fire Alarm Systems',
      'MV/LV Electrical Distribution',
    ],
    sameAs: ['https://www.linkedin.com/company/betavolt'],
  };

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'Service',
        position: 1,
        name: isAr ? 'مقاولات وبنية مراكز البيانات Tier III/IV' : 'Data Center Infrastructure Contracting (Tier III/IV)',
        description: isAr
          ? 'تنفيذ البنية التحتية المتكاملة لمراكز البيانات: كابلات الألياف، التبريد الدقيق CRAC، وحدات UPS، وعزل الممرات الباردة والساخنة.'
          : 'Turnkey data center engineering: structured cabling, precision CRAC/CRAH cooling, UPS distribution, and aisle containment.',
        provider: { '@id': `${baseUrl}/#organization` },
        serviceType: 'Electromechanical Contracting',
        url: `${baseUrl}/${locale}/services`,
      },
      {
        '@type': 'Service',
        position: 2,
        name: isAr ? 'أنظمة التحكم الذكي وإدارة المباني (BMS / SCADA)' : 'Smart Building Management Systems (BMS / SCADA)',
        description: isAr
          ? 'برمجة وتنفيذ منصات التحكم الذكي بالمباني وإدارة استهلاك الطاقة للمشاريع التجارية والصناعية الكبرى.'
          : 'Design and commissioning of integrated BMS, HVAC automation, energy management, and industrial SCADA.',
        provider: { '@id': `${baseUrl}/#organization` },
        serviceType: 'Building Automation',
        url: `${baseUrl}/${locale}/services`,
      },
      {
        '@type': 'Service',
        position: 3,
        name: isAr ? 'أنظمة التيار الخفيف والأمن والسلامة (ELV Systems)' : 'Low Current & ELV Security Infrastructure',
        description: isAr
          ? 'شبكات كاميرات المراقبة CCTV، إنذار الحريق المبكر، التحكم في الدخول، وأنظمة الاتصالات الهيكلية المعتمدة.'
          : 'High-security CCTV surveillance, fire detection, biometric access control, and enterprise LAN structured cabling.',
        provider: { '@id': `${baseUrl}/#organization` },
        serviceType: 'Low Current Systems',
        url: `${baseUrl}/${locale}/services`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
    </>
  );
}
