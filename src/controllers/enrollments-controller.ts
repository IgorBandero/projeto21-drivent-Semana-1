import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { enrollmentsService } from '@/services';

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

  return res.status(httpStatus.OK).send(enrollmentWithAddress);
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  const result : void | null = await enrollmentsService.createOrUpdateEnrollmentWithAddress({
    ...req.body,
    userId: req.userId,
  });

  if (result === null) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  } else {
    res.sendStatus(httpStatus.OK);
  }
}

// OK TODO - Receber o CEP do usuário por query params.
export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response) {
  const cep = req.query.cep as string;
  const address = await enrollmentsService.getAddressFromCEP(cep);
  if (!address) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  res.status(httpStatus.OK).send(address);
}
