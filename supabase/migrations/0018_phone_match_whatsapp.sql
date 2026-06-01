-- Single point of contact: phone number = WhatsApp number. Footer,
-- contact sidebar (`tel:` link), and the LocalBusiness JSON-LD
-- `telephone` field all read site_settings.phone, so this one
-- update propagates everywhere.
update site_settings set
  phone = '+32 479 38 80 46';
