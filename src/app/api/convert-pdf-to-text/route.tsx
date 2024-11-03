import {NextResponse} from "next/server";

export const maxDuration = 59; // 5 minutes

// import credintials from "./moltar-bc665-0fdafd009593.json";
export async function POST(req: Request) {
  const requestData = await req.json();
  const fileName = requestData.fileName;
  try {
    const vision = require("@google-cloud/vision").v1;

    let client;
    try {
      client = new vision.ImageAnnotatorClient({
        projectId: "ai-teacher-79270",
        // credentials: JSON.parse(
        //   process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY as string
        // ),
        credentials: {
          type: "service_account",
          project_id: "ai-teacher-79270",
          private_key_id: "bb96df32cb3511d524007e1a4862f66b714eb5c0",
          private_key:
            "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNwzc+H8M6uAqc\n5tJ3tsiQ9Xwoh5ArX+nIG3alBoOOl7VwErgk8K8snaWIjK3ajGicPJJFxmJruYax\nU1+N0dgO3jtLgVvQVrFhBH+p3NxvLJkhgj/t0YbS5THKMV6ujXRfF6nua0TxNncy\nXPvR/yikVNDStmWhchsNL1wT/pHgRnX8d961eFb0pUPdFtyX3MDoat6MI49uU4y8\n1MLS1TJp16ft2M0wkwlDkTyWsp2Hzdd2u1BNTspfX/VSszH1xhMJ2jZVFIApTGgJ\n5ZeT+dbTi9Z8qfS8yMpCk/m+ezwtlo9CuMy1gboRsU9EQ/uQVnsHtGqFZJ4HRzl9\nlj6xl9sTAgMBAAECggEAJeuqTKqx4ip02kG33BQ1lnGHdji1myjL/vMAxJ0UtbzD\n1Wm9wiERR5muHiI/EB38UX7gPje3f77rUdbZr1tTBDp0lw+6CgVQH18i3/0yKtL/\nTauheIS64jcXG/pJRsYPAk9sI+JlDEdLZF66khMCPHbdHVg8FqrezWlDAPRTkg9V\nmD8oQUVOzaDvkIEBFkJ9oCcGH609hZ8srPFH9lNe+2gPhFZSoUE1MuWK+U1boUWO\n4l3g+WZIAC8xKvL/DO0iyJjRRCFDedLlejXtdqvUiufY+8xko1yklfjfjJhZMMAY\nR3hlzwTin0XkjlXm1eY8tnZtxnZxMwAQqQ8YvToGwQKBgQDvMEB2/i3WMkWZtg3f\nJCOwUBxCpO6asEGSE/9qLDL0aBIyXaVE9otXXoeTexPhqJZGw2rYAbci46Qg3hci\noG04N2SdEbwdGtM0HMahTTORspJvcjMH/I2sUqwFYoaCbcAdKuiiR+0bVY9o9aKV\nFY7IC5kIuO4F9WPE24QCgauGowKBgQDcOYb2cBVM7/34YEBG2L/6HTCBZNNC75F8\nPyc6DYf5calrS9Prbk0/xor0zO9iac+TlaqxMxBP5LYUFOMQpi7Z8AOyVqoVPusq\nPNQw5ASk3/AfBp7DYeIudOYDwinC7MmUT9cBiHEamTDzvYQVTgjiPG63ypfrrU9Z\nI8sQj1RQ0QKBgHCyvH0UkEZPU4n0RJ7x6Trm1Bn2mlIaYBrS/1JoVu3fp0tB4mAX\nBlp5OModgKWfiIb5BnuWe1KeDbRK0H3JNwz41JhJReg0vnTcZh6UQIsSp3qJRVAr\nCBm8rj6vSI9l5NIZaJkl6KsrajHbIuq5yJerF0UL1WLLV2HmyFFiBY6fAoGALItW\nSTKSnGVOsZaGac4dxrFwxjtmn/tlKgR8Irnp7wKWiiVkUBKXfXbjVHC/WuCcI/X5\n+K2jdwWD7rvq0ctLXrm1hbUR4go/9uMm6Fy2s8K4Bw6Hvm1mGo96lvgHCm5qt50O\nmDjI5+Bkjmie9tA568jdfD92Sy1bB2S+BjN3koECgYEAqle1mTE9RtnWawSbk+JN\n3dcrEOJEymOJOyC+mG+9wPPuiRzviDV3eE72wR0O4YCsB3QAWCXdi1Amg0wziYH/\nOqG8Df0t46C0NZbpEU4x8VtmcdwE9jND8da5Eu0yQnNNVTInRjsO2ezFmUTiNHlA\nRXSOHJ3uNpAoFfEqRcqTl9E=\n-----END PRIVATE KEY-----\n",
          client_email: "ai-teacher-79270@appspot.gserviceaccount.com",
          client_id: "102479765070592543300",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url:
            "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url:
            "https://www.googleapis.com/robot/v1/metadata/x509/ai-teacher-79270%40appspot.gserviceaccount.com",
          universe_domain: "googleapis.com",
        },
      });
    } catch (clientError) {
      console.error(
        "Failed to initialize Google Cloud Vision client:",
        clientError
      );
      return NextResponse.json(
        {
          message:
            "Failed to initialize Vision client. Check credentials and project configuration.",
          error: clientError,
        },
        {status: 500}
      );
    }

    const bucketName = "ai-teacher-79270.appspot.com";
    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${fileName}/${fileName}.json`;

    const inputConfig = {
      mimeType: "application/pdf",
      gcsSource: {uri: gcsSourceUri},
    };
    const outputConfig = {
      gcsDestination: {uri: gcsDestinationUri},
    };
    const features = [{type: "DOCUMENT_TEXT_DETECTION"}];
    const request = {
      requests: [{inputConfig, features, outputConfig}],
    };

    let operation;
    try {
      [operation] = await client.asyncBatchAnnotateFiles(request);
    } catch (requestError) {
      console.error("Failed to start annotation operation:", requestError);
      return NextResponse.json(
        {
          message:
            "Annotation request failed. Verify file path and request format.",
          //   error: error,
        },
        {status: 500}
      );
    }

    let filesResponse;
    try {
      [filesResponse] = await operation.promise();
    } catch (operationError) {
      console.error("Annotation operation failed:", operationError);
      return NextResponse.json(
        {
          message:
            "Annotation operation encountered an error. Check job status and output settings.",
          error: operationError,
        },
        {status: 500}
      );
    }

    try {
      const destinationUri =
        filesResponse.responses[0].outputConfig.gcsDestination.uri;
      console.log("Json saved to:", destinationUri);
      return NextResponse.json({destinationUri, opID: operation.metadata.id});
    } catch (responseError) {
      console.error("Error processing the operation response:", responseError);
      return NextResponse.json(
        {
          message:
            "Error processing operation response. Check response format and GCS destination URI.",
          error: responseError,
        },
        {status: 500}
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        message: "Unexpected error occurred. Check server logs for details.",
        error,
      },
      {status: 500}
    );
  }
}

export async function GET() {
  try {
    // Imports the Google Cloud client libraries
    const vision = require("@google-cloud/vision").v1;

    // Creates a client
    const client = new vision.ImageAnnotatorClient({
      projectId: "ai-teacher-79270",

      // credentials: JSON.parse(
      //   process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY as string
      // ),
      credentials: {
        type: "service_account",
        project_id: "ai-teacher-79270",
        private_key_id: "bb96df32cb3511d524007e1a4862f66b714eb5c0",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNwzc+H8M6uAqc\n5tJ3tsiQ9Xwoh5ArX+nIG3alBoOOl7VwErgk8K8snaWIjK3ajGicPJJFxmJruYax\nU1+N0dgO3jtLgVvQVrFhBH+p3NxvLJkhgj/t0YbS5THKMV6ujXRfF6nua0TxNncy\nXPvR/yikVNDStmWhchsNL1wT/pHgRnX8d961eFb0pUPdFtyX3MDoat6MI49uU4y8\n1MLS1TJp16ft2M0wkwlDkTyWsp2Hzdd2u1BNTspfX/VSszH1xhMJ2jZVFIApTGgJ\n5ZeT+dbTi9Z8qfS8yMpCk/m+ezwtlo9CuMy1gboRsU9EQ/uQVnsHtGqFZJ4HRzl9\nlj6xl9sTAgMBAAECggEAJeuqTKqx4ip02kG33BQ1lnGHdji1myjL/vMAxJ0UtbzD\n1Wm9wiERR5muHiI/EB38UX7gPje3f77rUdbZr1tTBDp0lw+6CgVQH18i3/0yKtL/\nTauheIS64jcXG/pJRsYPAk9sI+JlDEdLZF66khMCPHbdHVg8FqrezWlDAPRTkg9V\nmD8oQUVOzaDvkIEBFkJ9oCcGH609hZ8srPFH9lNe+2gPhFZSoUE1MuWK+U1boUWO\n4l3g+WZIAC8xKvL/DO0iyJjRRCFDedLlejXtdqvUiufY+8xko1yklfjfjJhZMMAY\nR3hlzwTin0XkjlXm1eY8tnZtxnZxMwAQqQ8YvToGwQKBgQDvMEB2/i3WMkWZtg3f\nJCOwUBxCpO6asEGSE/9qLDL0aBIyXaVE9otXXoeTexPhqJZGw2rYAbci46Qg3hci\noG04N2SdEbwdGtM0HMahTTORspJvcjMH/I2sUqwFYoaCbcAdKuiiR+0bVY9o9aKV\nFY7IC5kIuO4F9WPE24QCgauGowKBgQDcOYb2cBVM7/34YEBG2L/6HTCBZNNC75F8\nPyc6DYf5calrS9Prbk0/xor0zO9iac+TlaqxMxBP5LYUFOMQpi7Z8AOyVqoVPusq\nPNQw5ASk3/AfBp7DYeIudOYDwinC7MmUT9cBiHEamTDzvYQVTgjiPG63ypfrrU9Z\nI8sQj1RQ0QKBgHCyvH0UkEZPU4n0RJ7x6Trm1Bn2mlIaYBrS/1JoVu3fp0tB4mAX\nBlp5OModgKWfiIb5BnuWe1KeDbRK0H3JNwz41JhJReg0vnTcZh6UQIsSp3qJRVAr\nCBm8rj6vSI9l5NIZaJkl6KsrajHbIuq5yJerF0UL1WLLV2HmyFFiBY6fAoGALItW\nSTKSnGVOsZaGac4dxrFwxjtmn/tlKgR8Irnp7wKWiiVkUBKXfXbjVHC/WuCcI/X5\n+K2jdwWD7rvq0ctLXrm1hbUR4go/9uMm6Fy2s8K4Bw6Hvm1mGo96lvgHCm5qt50O\nmDjI5+Bkjmie9tA568jdfD92Sy1bB2S+BjN3koECgYEAqle1mTE9RtnWawSbk+JN\n3dcrEOJEymOJOyC+mG+9wPPuiRzviDV3eE72wR0O4YCsB3QAWCXdi1Amg0wziYH/\nOqG8Df0t46C0NZbpEU4x8VtmcdwE9jND8da5Eu0yQnNNVTInRjsO2ezFmUTiNHlA\nRXSOHJ3uNpAoFfEqRcqTl9E=\n-----END PRIVATE KEY-----\n",
        client_email: "ai-teacher-79270@appspot.gserviceaccount.com",
        client_id: "102479765070592543300",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url:
          "https://www.googleapis.com/robot/v1/metadata/x509/ai-teacher-79270%40appspot.gserviceaccount.com",
        universe_domain: "googleapis.com",
      },
    });
    const bucketName = "ai-teacher-79270.appspot.com";
    const fileName = "dhrnn";
    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${fileName}/${fileName}.json`;

    const inputConfig = {
      // Supported mime_types are: 'application/pdf' and 'image/tiff'
      mimeType: "application/pdf",
      gcsSource: {
        uri: gcsSourceUri,
      },
    };
    const outputConfig = {
      gcsDestination: {
        uri: gcsDestinationUri,
      },
    };
    const features = [{type: "DOCUMENT_TEXT_DETECTION"}];
    const request = {
      requests: [
        {
          inputConfig: inputConfig,
          features: features,
          outputConfig: outputConfig,
        },
      ],
    };

    const [operation] = await client.asyncBatchAnnotateFiles(request);
    console.log("Operation:" + JSON.stringify(operation.latestResponse.name));
    const [filesResponse] = await operation.promise();

    const destinationUri =
      filesResponse.responses[0].outputConfig.gcsDestination.uri;
    console.log("Json saved to: " + destinationUri);

    return NextResponse.json({
      destinationUri,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}
