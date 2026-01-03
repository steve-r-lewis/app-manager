/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/licenseTemplate.ts
 * @version:    1.0.2
 * @createDate: 2026 Jan 01
 * @createTime: 22:47
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The LICENSE Template Generator.
 *
 * This template produces the legal text file (LICENSE) for the project or layer.
 * It supports two distinct licensing strategies as requested:
 *
 * 1. MIT (Permissive):
 * - [cite_start]Based on the specific text provided in your project standards[cite: 39, 42].
 * - Allows unlimited use, modification, and private sublicensing.
 * - Format: "Copyright [Year] [Author], [Email]"
 *
 * 2. GPLv3 (Strong Copyleft):
 * - Ensures that if the software is distributed, it must remain Open Source.
 * - Prevents proprietary "lock-down" of your code extensions.
 * - Uses the standard GNU General Public License Version 3 text.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.2, 20260101-23:13
 * - Implemented strict if/else control flow for clearer logic branching.
 * - Removed implicit return fall-throughs.
 * - Imports types from the central Barrel File.
 *
 * V1.0.1, 20260101-23:11
 * - Updated imports to use the central type aggregator (../types/index).
 * - Ensured template strings are syntax-safe.
 *
 * V1.0.0, 20260101-22:47
 * Initial creation and release of licenseTemplate.ts
 * Implements MIT (from upload) and GPLv3 (standard GNU text).
 *
 * ================================================================================
 */

import type { LicenseContext, TemplateFunction } from '../types/index';

/**
 * Generates the legal LICENSE text.
 */
export const licenseTemplate: TemplateFunction<LicenseContext, string> = (ctx) => {
	const year = ctx.year || new Date().getFullYear().toString();
	const author = ctx.author || 'Author';
	const email = ctx.email || 'email@example.com';
	
	// --------------------------------------------------------------------------
	// Logic Branching: Strict Control Flow
	// --------------------------------------------------------------------------
	
	if (ctx.licenseType === 'MIT') {
		// ----------------------------------------------------------------------
		// Option A: MIT License (Permissive)
		// ----------------------------------------------------------------------
		return `Copyright ${year} ${author}, ${email}

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`;
	} else {
		// ----------------------------------------------------------------------
		// Option B: GPLv3 License (Strong Copyleft)
		// ----------------------------------------------------------------------
		const authorLine = `Copyright (C) ${year} ${author} ` + '<' + email + '>';
		return `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) ${authorLine}
Everyone is permitted to copy and distribute verbatim copies of this license document, but changing it is not allowed.

                            Preamble

The GNU General Public License is a free, copyleft license for software and other kinds of works.

The licenses for most software and other practical works are designed to take away your freedom to share and change the works. By contrast, the GNU General Public License is intended to guarantee your freedom to share and change all versions of a program--to make sure it remains free software for all its users. We, the Free Software Foundation, use the GNU General Public License for most of our software; it applies also to any other work released this way by its authors. You can apply it to your programs, too.

When we speak of free software, we are referring to freedom, not price. Our General Public Licenses are designed to make sure that you have the freedom to distribute copies of free software (and charge for them if you wish), that you receive source code or can get it if you want it, that you can change the software or use pieces of it in new free programs, and that you know you can do these things.

To protect your rights, we need to prevent others from denying you these rights or asking you to surrender the rights. Therefore, you have certain responsibilities if you distribute copies of the software, or if you modify it: responsibilities to respect the freedom of others.

For example, if you distribute copies of such a program, whether gratis or for a fee, you must pass on to the recipients the same freedoms that you received. You must make sure that they, too, receive or can get the source code. And you must show them these terms so they know their rights.

TERMS AND CONDITIONS

0. Definitions.
"This License" refers to version 3 of the GNU General Public License.
"Copyright" also means copyright-like laws that apply to other kinds of works, such as semiconductor masks.
"The Program" refers to any copyrightable work licensed under this License. Each licensee is addressed as "you". "Licensees" and "recipients" may be individuals or organizations.

To "modify" a work means to copy from or adapt all or part of the work in a fashion requiring copyright permission, other than the making of an exact copy. The resulting work is called a "modified version" of the earlier work or a work "based on" the earlier work.

A "covered work" means either the unmodified Program or a work based on the Program.

To "propagate" a work means to do anything with it that, without permission, would make you directly or secondarily liable for infringement under applicable copyright law, except executing it on a computer or modifying a private copy. Propagation includes copying, distribution (with or without modification), making available to the public, and in some countries other activities as well.

To "convey" a work means any kind of propagation that enables other parties to make or receive copies. Mere interaction with a user through a computer network, with no transfer of a copy, is not conveying.

5. Conveying Modified Source Versions.
You may convey a work based on the Program, or the modifications to produce it from the Program, in the form of source code under the terms of section 4, provided that you also meet all of these conditions:
    a) The work must carry prominent notices stating that you modified it, and giving a relevant date.
    b) The work must carry prominent notices stating that it is released under this License and any conditions added under section 7.
    c) You must license the entire work, as a whole, under this License to anyone who comes into possession of a copy. This License will therefore apply, along with any applicable section 7 additional terms, to the whole of the work, and all its parts, regardless of how they are packaged. This License gives no permission to license the work in any other way, but it does not invalidate such permission if you have separately received it.

END OF TERMS AND CONDITIONS
`;
	}
};