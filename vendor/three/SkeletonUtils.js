import {
	AnimationClip,
	AnimationMixer,
	Matrix4,
	Quaternion,
	QuaternionKeyframeTrack,
	SkeletonHelper,
	Vector3,
	VectorKeyframeTrack,
	PropertyBinding
} from './three.module.js';

function retarget( target, source, options = {} ) {

	const pos = new Vector3();
	const quat = new Quaternion();
	const scale = new Vector3();
	const bindBoneMatrix = new Matrix4();
	const relativeMatrix = new Matrix4();
	const globalMatrix = new Matrix4();

	options.preserveMatrix = options.preserveMatrix !== undefined ? options.preserveMatrix : true;
	options.preservePosition = options.preservePosition !== undefined ? options.preservePosition : true;
	options.preserveHipPosition = options.preserveHipPosition !== undefined ? options.preserveHipPosition : false;
	options.useTargetMatrix = options.useTargetMatrix !== undefined ? options.useTargetMatrix : false;
	options.hip = options.hip !== undefined ? options.hip : 'hip';
	options.names = options.names || {};
	options.offsets = options.offsets || {};
	options.rotationOffsets = options.rotationOffsets || {};
	options.scale = options.scale || 1;

	const sourceBones = getBones( source );
	const bones = getBones( target );

	if ( target.isObject3D ) {

		target.updateMatrixWorld();

	}

	for ( let i = 0; i < bones.length; ++ i ) {

		const bone = bones[ i ];
		const name = options.names[ bone.name ] || bone.name;
		const boneTo = getBoneByName( name, sourceBones );

		if ( boneTo ) {

			bone.matrixWorld.decompose( pos, quat, scale );
			globalMatrix.compose( pos, quat, scale );

			if ( options.useTargetMatrix ) {

				relativeMatrix.copy( boneTo.matrixWorld );

			} else {

				relativeMatrix.copy( target.matrixWorld ).invert();
				relativeMatrix.multiply( boneTo.matrixWorld );

			}

			const offset = options.offsets[ bone.name ];
			if ( offset ) {

				relativeMatrix.multiply( offset );

			}

			const rotationOffset = options.rotationOffsets[ bone.name ];
			if ( rotationOffset ) {

				bindBoneMatrix.makeRotationFromQuaternion( rotationOffset );
				relativeMatrix.multiply( bindBoneMatrix );

			}

			relativeMatrix.decompose( pos, quat, scale );

			if ( bone.parent && bone.parent.isBone ) {

				bone.parent.matrixWorld.decompose( pos, quat, scale );
				globalMatrix.copy( bone.parent.matrixWorld ).invert();
				relativeMatrix.multiplyMatrices( globalMatrix, relativeMatrix );

			}

			relativeMatrix.decompose( pos, quat, scale );

			if ( options.preservePosition ) {

				pos.copy( bone.position );

			}

			if ( options.preserveHipPosition && bone.name === options.hip ) {

				pos.set( pos.x, bone.position.y, pos.z );

			}

			bone.position.copy( pos );
			bone.quaternion.copy( quat );
			bone.scale.copy( scale );
			bone.updateMatrix();
			bone.updateMatrixWorld();

		}

	}

	if ( options.preserveMatrix ) {

		target.updateMatrixWorld( true );

	}

	return target;

}

function retargetClip( target, source, clip, options = {} ) {

	options.useFirstFramePosition = options.useFirstFramePosition !== undefined ? options.useFirstFramePosition : false;
	options.fps = options.fps !== undefined ? options.fps : 30;

	const numFrames = Math.round( clip.duration * options.fps );
	const delta = 1 / options.fps;
	const convertedTracks = [];
	const mixer = new AnimationMixer( source );
	const bones = getBones( target );
	const boneDatas = [];
	const helpers = [];

	let sourceClip = clip;
	if ( source.isObject3D ) {

		sourceClip = new AnimationClip( clip.name, clip.duration, clip.tracks );

	}

	const mixerClip = mixer.clipAction( sourceClip );
	mixerClip.play();

	for ( let i = 0; i < bones.length; ++ i ) {

		boneDatas.push( {
			bone: bones[ i ],
			pos: [],
			quat: [],
			times: []
		} );

	}

	for ( let frame = 0; frame < numFrames; ++ frame ) {

		const time = frame * delta;
		mixer.setTime( time );
		retarget( target, source, options );

		for ( let i = 0; i < boneDatas.length; ++ i ) {

			const boneData = boneDatas[ i ];
			const bone = boneData.bone;

			boneData.times.push( time );
			boneData.pos.push( bone.position.x, bone.position.y, bone.position.z );
			boneData.quat.push( bone.quaternion.x, bone.quaternion.y, bone.quaternion.z, bone.quaternion.w );

		}

	}

	for ( let i = 0; i < boneDatas.length; ++ i ) {

		const boneData = boneDatas[ i ];

		if ( boneData.pos.length ) {

			convertedTracks.push( new VectorKeyframeTrack( `${boneData.bone.name}.position`, boneData.times, boneData.pos ) );

		}

		if ( boneData.quat.length ) {

			convertedTracks.push( new QuaternionKeyframeTrack( `${boneData.bone.name}.quaternion`, boneData.times, boneData.quat ) );

		}

	}

	for ( let i = 0; i < helpers.length; ++ i ) {

		helpers[ i ].dispose();

	}

	mixer.uncacheClip( sourceClip );

	return new AnimationClip( clip.name, - 1, convertedTracks );

}

function clone( source ) {

	const sourceLookup = new Map();
	const cloneLookup = new Map();
	const cloned = source.clone();

	parallelTraverse( source, cloned, ( sourceNode, clonedNode ) => {

		sourceLookup.set( clonedNode, sourceNode );
		cloneLookup.set( sourceNode, clonedNode );

	} );

	cloned.traverse( ( node ) => {

		if ( ! node.isSkinnedMesh ) {

			return;

		}

		const sourceMesh = sourceLookup.get( node );
		const sourceBones = sourceMesh.skeleton.bones;

		node.skeleton = sourceMesh.skeleton.clone();
		node.bindMatrix.copy( sourceMesh.bindMatrix );
		node.skeleton.bones = sourceBones.map( ( bone ) => cloneLookup.get( bone ) );
		node.bind( node.skeleton, node.bindMatrix );

	} );

	return cloned;

}

function getBoneByName( name, skeleton ) {

	for ( let i = 0, il = skeleton.length; i < il; i ++ ) {

		if ( skeleton[ i ].name === name ) {

			return skeleton[ i ];

		}

	}

}

function getBones( object ) {

	if ( object.isSkeletonHelper ) {

		return object.bones;

	}

	if ( object.isSkinnedMesh ) {

		return object.skeleton.bones;

	}

	const bones = [];
	object.traverse( ( bone ) => {

		if ( bone.isBone ) {

			bones.push( bone );

		}

	} );
	return bones;

}

function parallelTraverse( a, b, callback ) {

	callback( a, b );

	for ( let i = 0; i < a.children.length; i ++ ) {

		parallelTraverse( a.children[ i ], b.children[ i ], callback );

	}

}

export { clone, retarget, retargetClip };
