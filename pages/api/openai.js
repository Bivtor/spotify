import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const configuration = new Configuration({
    organization: "org-W2K6dIRSzYiXDg5P7QCBrUSN",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const str = req.body;
    const genres = JSON.parse(str).slice(0, 5); // get the first 5 genres
    let prompt = `Send me back a roughly 100 word analysis of what these top 5 genres of music taste say about a person: ${genres.join(", ")}, be as precise as possible, and begin the message with "your top genres show that" etc`;

    // Test Message
    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: prompt,
    //   max_tokens: 110,
    //   temperature: 0.3,
    // });

    // console.log(response.data);
    // res.status(200).json(response.data.choices[0].text);

    res.status(200).json("The person's music taste reveals a preference for a variety of genres. Baroque pop, chamber pop, and indie rock indicate an appreciation for melodic and lyrical complexity, while garage rock and indietronica suggest an inclination towards");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error (my message)" });
  }
}
