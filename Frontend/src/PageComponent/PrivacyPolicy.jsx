// src/components/PrivacyPolicy.jsx
const PrivacyPolicy = () => {
  return (
    <div className="text-color ms-5 me-5 mt-3">
      <h4 className="mb-3">Privacy Policy</h4>
      <p>
        At <strong>FoodStone</strong>, we value your privacy and are committed to protecting your personal information.
        This policy explains how we collect, use, and safeguard your data:
      </p>

      <ul>
        <li><strong>Data Collection:</strong> We collect necessary information like name, email, phone number, and address to process orders.</li>
        <li><strong>Usage:</strong> Your data is used for order fulfillment, customer service, and sending order updates.</li>
        <li><strong>Security:</strong> We use secure encryption methods to protect your data and prevent unauthorized access.</li>
        <li><strong>Sharing:</strong> We do not sell or share your personal data with third parties without your consent.</li>
        <li><strong>Cookies:</strong> Our website uses cookies to enhance user experience and collect usage statistics.</li>
        <li><strong>Contact:</strong> For any concerns, email us at <a href="mailto:privacy@foodstone.com">privacy@foodstone.com</a>.</li>
      </ul>

      <p>
        By using our platform, you agree to the terms outlined in this privacy policy.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
