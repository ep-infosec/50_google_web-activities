/**
 * @license
 * Copyright 2017 The Web Activities Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*eslint no-unused-vars: 0*/


/**
 * @enum {string}
 */
export const ActivityMode = {
  IFRAME: 'iframe',
  POPUP: 'popup',
  REDIRECT: 'redirect',
};


/**
 * The result code used for `ActivityResult`.
 * @enum {string}
 */
export const ActivityResultCode = {
  OK: 'ok',
  CANCELED: 'canceled',
  FAILED: 'failed',
};


/**
 * The result of an activity. The activity implementation returns this object
 * for a successful result, a cancelation or a failure.
 * @struct
 */
export class ActivityResult {
  /**
   * @param {!ActivityResultCode} code
   * @param {*} data
   * @param {!ActivityMode} mode
   * @param {string} origin
   * @param {boolean} originVerified
   * @param {boolean} secureChannel
   */
  constructor(code, data, mode, origin, originVerified, secureChannel) {
    /** @const {!ActivityResultCode} */
    this.code = code;
    /** @const {*} */
    this.data = code == ActivityResultCode.OK ? data : null;
    /** @const {!ActivityMode} */
    this.mode = mode;
    /** @const {string} */
    this.origin = origin;
    /** @const {boolean} */
    this.originVerified = originVerified;
    /** @const {boolean} */
    this.secureChannel = secureChannel;
    /** @const {boolean} */
    this.ok = code == ActivityResultCode.OK;
    /** @const {?Error} */
    this.error = code == ActivityResultCode.FAILED ?
        new Error(String(data) || '') :
        null;
  }
}


/**
 * The activity request that different types of hosts can be started with.
 * @typedef {{
 *   requestId: string,
 *   returnUrl: string,
 *   args: ?Object,
 *   origin: (string|undefined),
 *   originVerified: (boolean|undefined),
 * }}
 */
export let ActivityRequestDef;


/**
 * The activity "open" options used for popups and redirects.
 *
 * - returnUrl: override the return URL. By default, the current URL will be
 *   used.
 * - skipRequestInUrl: removes the activity request from the URL, in case
 *   redirect is used. By default, the activity request is appended to the
 *   activity URL. This option can be used if the activity request is passed
 *   to the activity by some alternative means.
 * - disableRedirectFallback: disallows popup fallback to redirect. By default
 *   the redirect fallback is allowed. This option has to be used very carefully
 *   because there are many user agents that may fail to open a popup and it
 *   won't be always possible for the opener window to even be aware of such
 *   failures.
 *
 * @typedef {{
 *   returnUrl: (string|undefined),
 *   skipRequestInUrl: (boolean|undefined),
 *   disableRedirectFallback: (boolean|undefined),
 *   width: (number|undefined),
 *   height: (number|undefined),
 * }}
 */
export let ActivityOpenOptionsDef;


/**
 * Activity client-side binding. The port provides limited ways to communicate
 * with the activity and receive signals and results from it. Not every type
 * of activity exposes a port.
 *
 * @interface
 */
export class ActivityPortDef {

  /**
   * Returns the mode of the activity: iframe, popup or redirect.
   * @return {!ActivityMode}
   */
  getMode() {}

  /**
   * Accepts the result when ready. The client should verify the activity's
   * mode, origin, verification and secure channel flags before deciding
   * whether or not to trust the result.
   *
   * Returns the promise that yields when the activity has been completed and
   * either a result, a cancelation or a failure has been returned.
   *
   * @return {!Promise<!ActivityResult>}
   */
  acceptResult() {}
}


/**
 * Activity client-side binding for messaging.
 *
 * Whether the host can or cannot receive a message depends on the type of
 * host and its state. Ensure that the code has an alternative path if
 * messaging is not available.
 *
 * @interface
 */
export class ActivityMessagingPortDef {

  /**
   * Returns the target window where host is loaded. May be unavailable.
   * @return {?Window}
   */
  getTargetWin() {}

  /**
   * Sends a message to the host.
   * @param {!Object} payload
   */
  message(payload) {}

  /**
   * Registers a callback to receive messages from the host.
   * @param {function(!Object)} callback
   */
  onMessage(callback) {}

  /**
   * Creates a new communication channel or returns an existing one.
   * @param {string=} opt_name
   * @return {!Promise<!MessagePort>}
   */
  messageChannel(opt_name) {}
}


/**
 * Activity implementation. The host provides interfaces, callbacks and
 * signals for the activity's implementation to communicate with the client
 * and return the results.
 *
 * @interface
 */
export class ActivityHostDef {

  /**
   * Returns the mode of the activity: iframe, popup or redirect.
   * @return {!ActivityMode}
   */
  getMode() {}

  /**
   * The request string that the host was started with. This value can be
   * passed around while the target host is navigated.
   *
   * Not always available; in particular, this value is not available for
   * iframe hosts.
   *
   * See `ActivityRequestDef` for more info.
   *
   * @return {?string}
   */
  getRequestString() {}

  /**
   * The client's origin. The connection to the client must first succeed
   * before the origin can be known with certainty.
   * @return {string}
   */
  getTargetOrigin() {}

  /**
   * Whether the client's origin has been verified. This depends on the type of
   * the client connection. When window messaging is used (for iframes and
   * popups), the origin can be verified. In case of redirects, where state is
   * passed in the URL, the verification is not fully possible.
   * @return {boolean}
   */
  isTargetOriginVerified() {}

  /**
   * Whether the client/host communication is done via a secure channel such
   * as messaging, or an open and easily exploitable channel, such redirect URL.
   * Iframes and popups use a secure channel, and the redirect mode does not.
   * @return {boolean}
   */
  isSecureChannel() {}

  /**
   * Signals to the host to accept the connection. Before the connection is
   * accepted, no other calls can be made, such as `ready()`, `result()`, etc.
   *
   * Since the result of the activity could be sensitive, the host API requires
   * you to verify the connection. The host can use the client's origin,
   * verified flag, whether the channel is secure, activity arguments, and other
   * properties to confirm whether the connection should be accepted.
   *
   * The client origin is verifiable in popup and iframe modes, but may not
   * be verifiable in the redirect mode. The channel is secure for iframes and
   * popups and not secure for redirects.
   */
  accept() {}

  /**
   * The arguments the activity was started with. The connection to the client
   * must first succeed before the origin can be known with certainty.
   * @return {?Object}
   */
  getArgs() {}

  /**
   * Signals to the opener that the host is ready to be interacted with.
   */
  ready() {}

  /**
   * Whether the supplemental messaging suppored for this host mode. Only iframe
   * hosts can currently send and receive messages.
   * @return {boolean}
   */
  isMessagingSupported() {}

  /**
   * Sends a message to the client. Notice that only iframe hosts can send and
   * receive messages.
   * @param {!Object} payload
   */
  message(payload) {}

  /**
   * Registers a callback to receive messages from the client. Notice that only
   * iframe hosts can send and receive messages.
   * @param {function(!Object)} callback
   */
  onMessage(callback) {}

  /**
   * Creates a new supplemental communication channel or returns an existing
   * one. Notice that only iframe hosts can send and receive messages.
   * @param {string=} opt_name
   * @return {!Promise<!MessagePort>}
   */
  messageChannel(opt_name) {}

  /**
   * Signals to the activity client the result of the activity.
   * @param {*} data
   */
  result(data) {}

  /**
   * Signals to the activity client that the activity has been canceled by the
   * user.
   */
  cancel() {}

  /**
   * Signals to the activity client that the activity has unrecoverably failed.
   * @param {!Error|string} reason
   */
  failed(reason) {}

  /**
   * Set the size container. This element will be used to measure the
   * size needed by the iframe. Not required for non-iframe hosts. The
   * needed height is calculated as `sizeContainer.scrollHeight`.
   * @param {!Element} element
   */
  setSizeContainer(element) {}

  /**
   * Signals to the activity client that the activity's size needs might have
   * changed. Not required for non-iframe hosts.
   */
  resized() {}

  /**
   * The callback the activity implementation can implement to react to changes
   * in size. Normally, this callback is called in reaction to the `resized()`
   * method.
   * @param {function(number, number, boolean)} callback
   */
  onResizeComplete(callback) {}

  /**
   * Disconnect the activity implementation and cleanup listeners.
   */
  disconnect() {}
}
