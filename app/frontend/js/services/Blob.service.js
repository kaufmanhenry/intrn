angular.module('intrn')
    .factory('Blob', ['API_BASE', '$resource', function (API_BASE, $resource) {
        var APIBlob = {};

        APIBlob.resource = $resource(API_BASE + 'blobs/:blob_id', {
            blob_id: '@_id'
        }, {
            queryJobs: {
                method: 'GET',
                url: API_BASE + 'blobs/jobs/:job_id',
                isArray: true
            }
        });

        APIBlob.uploadBase64Url = function (base64Urlblob, body) {
            var split = base64Urlblob.split(',');
            var contentType = split[0].split(':')[1].split(';')[0];
            return APIBlob.uploadBase64(split[1], body, {
                type: contentType
            });
        };

        APIBlob.uploadBase64 = function (base64blob, body, options) {
            var binaryImg = $base64.decode(base64blob);
            var length = binaryImg.length;
            var ab = new ArrayBuffer(length);
            var ua = new Uint8Array(ab);
            for (var i = 0; i < length; i++) {
                ua[i] = binaryImg.charCodeAt(i);
            }
            var blob = new Blob([ua], options);
            return APIBlob.uploadBlob(blob, body);
        };

        APIBlob.uploadBlob = function (blob, body) {

            if (!body.user) throw new Error('body.user required is required for blob upload');
            body.user = body.user._id || body.user;
            if (typeof body.user !== 'string') throw new Error('body.user must be a string or have a string _id');
            if (typeof body.filename !== 'string') throw new Error('body.filename must be a string');

            var fd = new FormData();
            Object.keys(body).forEach(function (key) {
                var val = body[key];
                if (typeof val !== 'string') val = JSON.stringify(val);
                fd.append(key, val);
            });
            fd.append('file', blob);
            return $http.post(API_BASE + 'blobs', fd, {
                tranformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };

        return Blob;
    }]);