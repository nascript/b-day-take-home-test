import { Request, Response, NextFunction } from "express";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { firstName, lastName, birthday, timezone, email } = req.body;

  if (!firstName || !lastName || !birthday || !timezone || !email) {
    res.status(400).json({
      message:
        "All fields (firstName, lastName, birthday, timezone, email) are required.",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format." });
    return;
  }

  const iso8601Regex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
  if (!iso8601Regex.test(birthday)) {
    res.status(400).json({
      message:
        "Invalid birthday format. Use ISO 8601 format with timezone (e.g., 1991-02-03T17:30:00.123+07:00).",
    });
    return;
  }

  next();
};
