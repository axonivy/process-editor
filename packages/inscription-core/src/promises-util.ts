// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

// from https://github.com/eclipse-theia/theia/blob/4d7f225e8c87c51152ed605b3f47460f0163a408/packages/core/src/common/promise-util.ts#L4
export class Deferred<T = void> {
  state: 'resolved' | 'rejected' | 'unresolved' = 'unresolved';
  resolve: (value: T | PromiseLike<T>) => void = () => {};
  reject: (err?: unknown) => void = () => {};

  promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  }).then(
    res => (this.setState('resolved'), res),
    err => (this.setState('rejected'), Promise.reject(err))
  );

  protected setState(state: 'resolved' | 'rejected'): void {
    if (this.state === 'unresolved') {
      this.state = state;
    }
  }
}
