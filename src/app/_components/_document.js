import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google Maps API script with your API key */}
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDM6uQ-3BqCn5EK7OHPhajoS6pZrao1mn4&libraries=places`}
            async
            defer
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
