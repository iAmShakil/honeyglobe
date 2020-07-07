import { Request, RequestHandler } from 'express'

declare function honeyglobe (options: honeyglobe.Options): Multer

declare class Multer {
  /**
   * Returns middleware that processes a single file associated with the
   * given form field.
   *
   * The `Request` object will be populated with a `file` object containing
   * information about the processed file.
   *
   * @param fieldName Name of the multipart form field to process.
   */
  single(fieldName: string): RequestHandler;
  /**
   * Returns middleware that processes multiple files sharing the same field
   * name.
   *
   * The `Request` object will be populated with a `files` array containing
   * an information object for each processed file.
   *
   * @param fieldName Shared name of the multipart form fields to process.
   * @param maxCount Optional. Maximum number of files to process. (default: Infinity)
   * @throws `MulterError('LIMIT_UNEXPECTED_FILE')` if more than `maxCount` files are associated with `fieldName`
   */
  array(fieldName: string, maxCount?: number): RequestHandler;
  /**
   * Returns middleware that processes multiple files associated with the
   * given form fields.
   *
   * The `Request` object will be populated with a `files` object which
   * maps each field name to an array of the associated file information
   * objects.
   *
   * @param fields Array of `Field` objects describing multipart form fields to process.
   * @throws `MulterError('LIMIT_UNEXPECTED_FILE')` if more than `maxCount` files are associated with `fieldName` for any field.
   */
  fields(fields: ReadonlyArray<honeyglobe.Field>): RequestHandler;
  /**
   * Returns middleware that processes all files contained in the multipart
   * request.
   *
   * The `Request` object will be populated with a `files` array containing
   * an information object for each processed file.
   */
  any(): RequestHandler;
  /**
   * Returns middleware that accepts only non-file multipart form fields.
   *
   * @throws `MulterError('LIMIT_UNEXPECTED_FILE')` if any file is encountered.
   */
  none(): RequestHandler;
}

declare namespace honeyglobe {
  /** Options for initializing a Multer instance. */
  interface Options {
    /**
     * The destination directory for uploaded files.
     */
    destination: string;
    /**
     * An object specifying various limits on incoming data. This object is
     * passed to Busboy directly, and the details of properties can be found
     * at https://github.com/mscdex/busboy#busboy-methods.
     */
    limits?: {
        /** Maximum size of each form field name in bytes. (Default: 100) */
        fieldNameSize?: number;
        /** Maximum size of each form field value in bytes. (Default: 1048576) */
        fieldSize?: number;
        /** Maximum number of non-file form fields. (Default: Infinity) */
        fields?: number;
        /** Maximum size of each file in bytes. (Default: Infinity) */
        fileSize?: number;
        /** Maximum number of file fields. (Default: Infinity) */
        files?: number;
        /** Maximum number of parts (non-file fields + files). (Default: Infinity) */
        parts?: number;
        /** Maximum number of headers. (Default: 2000) */
        headerPairs?: number;
    };
    /** Preserve the full path of the original filename rather than the basename. (Default: false) */
    preservePath?: boolean;
    fileTypes?: Array<string>;
  }

  /**
   * An object describing a field name and the maximum number of files with
   * that field name to accept.
   */
  interface Field {
    /** The field name. */
    name: string;
    /** Optional maximum number of files per field to accept. (Default: Infinity) */
    maxCount?: number;
  }
}

export = honeyglobe
