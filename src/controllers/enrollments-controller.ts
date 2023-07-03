import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import enrollmentsService from '@/services/enrollments-service';
import { notFoundError } from '@/errors';

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

    return res.status(httpStatus.OK).send(enrollmentWithAddress);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  if(!req.body || !req.userId) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    await enrollmentsService.createOrUpdateEnrollmentWithAddress({
      ...req.body,
      userId: req.userId,
    });
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.send(httpStatus.BAD_REQUEST);
    }
    else{
      return res.send(httpStatus.BAD_REQUEST)
    }    
  }
}

// TODO - Receber o CEP do usuário por query params.
export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response) {
  const cep : string = (req.query.cep).toString()
  if(cep.split('').length !== 8) return res.send(httpStatus.NO_CONTENT);
  try {
    const address = await enrollmentsService.getAddressFromCEP(cep);
    res.status(httpStatus.OK).send(address);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.send(httpStatus.NO_CONTENT);
    }
    else{
      return res.send(httpStatus.BAD_REQUEST)
    }
  }
}
