import { Request, Response } from "express";
import YoutubeRequest from "../schemas/youtubeRequest";

const objectName = "youtube download request";

// - GET - /youtube/requests
export let allRequests = (req: Request, res: Response) => {
  let newDocument = YoutubeRequest.find((err, newDocument) => {
    res.send(err ? err : newDocument);
  });
};

// - GET - /youtube/requests/:id
export let getRequest = (req: Request, res: Response) => {
  YoutubeRequest.findById(req.params.id, (err, newDocument) => {
    res.send(err ? err : newDocument);
  });
};

// - PUT - /youtube/requests/:id
export let addRequest = (req: Request, res: Response) => {
  YoutubeRequest.findOne({ id: req.body.id }).then(async (result: any) => {
    if (result) {
      // Fix formatting, if any
    //   if (!result.status) {
    //     const update = {
    //       id: result.id,
    //       query: result.query,
    //       status: "pending",
    //     };
    //     await result.updateOne(update);
    //   }
      res.status(409).send(result);
    } else {
      let newDocument = new YoutubeRequest(req.body);
      newDocument.save((err) => {
        res.send(err ? err : newDocument);
      });
    }
  });
};

// - DELETE - /youtube/requests/:id
export let deleteRequest = (req: Request, res: Response) => {
  YoutubeRequest.deleteOne({ _id: req.params.id }, (err) => {
    res.send(err ? err : `Successfully deleted ${objectName}`);
  });
};

// - POST - /book/requests/:id
export let updateRequest = (req: Request, res: Response) => {
  YoutubeRequest.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
    res.send(err ? err : `Successfully updated ${objectName}`);
  });
};
